import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./src/config/db.js";
import jwt from "jsonwebtoken";

import { createServer } from "http";
import { Server } from "socket.io";

import { saveMessageService, } from "./src/modules/client/chat/chat.service.js";
import Conversation from "./src/modules/client/chat/conversation.model.js";
import Message from "./src/modules/client/chat/chat.model.js";
import { encryptMessage } from "./src/shared/utils/crypto.js";


const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);
const onlineUsers = new Map();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.use((socket, next) => {
  let token = socket.handshake.auth.token;

  console.log("TOKEN RECEIVED:", token);

  if (!token) {
    return next(new Error("Unauthorized - No token"));
  }

  try {

    token = token.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    console.log("DECODED:", decoded);

    socket.user = decoded;
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    next(new Error("Unauthorized - Invalid token"));
  }
});
// io.use((socket, next) => {

//     console.log("AUTH DATA:", socket.handshake.auth); // 👈 PUT IT HERE (first line inside)

//   console.log(socket.handshake.auth);

//   const token = socket.handshake.auth.token;

//   if (!token) {
//     return next(
//       new Error("Unauthorized")
//     );
//   }

//   try {

//     const decoded = jwt.verify( 
//         token,
//         process.env.JWT_ACCESS_SECRET);

//     socket.user = decoded;

//     next();

//   } catch (error) {

//     next(
//       new Error("Unauthorized")
//     );
//   }
// });

io.on("connection", (socket) => {

  console.log("User Connected:", socket.id);
  const userId = socket.user?.userId;

  if (userId) {
    onlineUsers.set(userId, socket.id);

    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  }

  socket.on("joinConversation", (conversationId) => {
    if (!conversationId) return;

    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });

    socket.join(conversationId);

    console.log(`Joined room: ${conversationId}`);
  });



  socket.on("sendMessage", async (data) => {

    try {

      if (
        !data?.messageId ||
        !data?.conversationId ||
        !data?.sender ||
        !data?.text?.trim()
      ) {
        console.log("VALIDATION FAILED");

        return;
      }

      console.log("MESSAGE RECEIVED:", data);
      console.log("BEFORE SAVE");

       const existing = await Message.findOne({
      messageId: data.messageId,
    });

if (existing) {
  console.log("DUPLICATE MESSAGE BLOCKED:", data.messageId);
  return;
}
      const savedMessage =
        await saveMessageService({
            messageId: data.messageId,   

          conversationId: data.conversationId,

          sender: data.sender,
          senderModel: data.senderModel,

          receiver: data.receiver,
          receiverModel: data.receiverModel,

          text: encryptMessage(data.text),
        });
      console.log("AFTER SAVE");

      console.log("MESSAGE SAVED:", savedMessage);


      await Conversation.findByIdAndUpdate(
        data.conversationId,
        {
          latestMessage: savedMessage._id,
        }
      );

      const conversation = await Conversation.findById(data.conversationId);

      if (!conversation) return;

      const receiver = conversation.participants.find((p) => {
        const participantId =
          p.userId?._id?.toString() ||
          p.userId?.toString();

        return participantId !== data.sender.toString();
      });

      if (!receiver) return;

      const receiverType = receiver.userType;

      if (receiverType === "Lawyer") {
        await Conversation.findByIdAndUpdate(data.conversationId, {
          $inc: { "unreadCount.lawyer": 1 },
        });
      } else {
        await Conversation.findByIdAndUpdate(data.conversationId, {
          $inc: { "unreadCount.client": 1 },
        });
      }

      const populatedMessage =
        await Message.findById(savedMessage._id)
          .populate({
            path: "sender",
            model: data.senderModel,
          })
          .populate({
            path: "receiver",
            model: data.receiverModel,
          });

      io.to(data.conversationId).emit(
        "receiveMessage",
        populatedMessage
      );

    } catch (err) {

      console.log(
        "Socket save error:",
        err.message
      );
    }
  });

  socket.on("markSeen", async ({
    conversationId,
    userId,
    userModel,
  }) => {

    await Message.updateMany(
      {
        conversationId,
        receiver: userId,
        receiverModel: userModel,
        seen: false,
      },
      {
        seen: true,
      }
    );

    io.to(conversationId).emit(
      "messagesSeen"
    );

    if (userModel === "Lawyer") {

      await Conversation.findByIdAndUpdate(
        conversationId,
        {
          "unreadCount.lawyer": 0,
        }
      );

    } else {

      await Conversation.findByIdAndUpdate(
        conversationId,
        {
          "unreadCount.client": 0,
        }
      );
    }
  });

  socket.on("typing", (conversationId) => {

    socket.to(conversationId).emit(
      "typing"
    );
  });

  socket.on("stopTyping", (conversationId) => {

    socket.to(conversationId).emit(
      "stopTyping"
    );
  });

  socket.on("disconnect", () => {
    const userId = socket.user?.userId;

    if (userId) {
      const storedSocketId = onlineUsers.get(userId);

      if (storedSocketId === socket.id) {
        onlineUsers.delete(userId);
      }

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    }

    console.log("User Disconnected:", socket.id);
  });
});

const startServer = async () => {

  try {

    await connectDB();

    httpServer.listen(PORT, () => {

      console.log(
        `Server running on ${PORT}`
      );
    });

  } catch (error) {

    console.error(
      "Failed to start server:",
      error.message
    );

    process.exit(1);
  }
};

startServer();

