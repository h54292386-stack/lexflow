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
import {
  setSocketData,
} from "./src/socket/socket.js";

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);
const onlineUsers = new Map();


const io = new Server(
  httpServer,
  {
    cors: {
      origin:
        "http://localhost:5173",
      credentials: true,
    },
  }
);

setSocketData(
  io,
  onlineUsers
);

io.use((socket, next) => {
  let token = socket.handshake.auth.token;


  if (!token) {
    return next(new Error("Unauthorized - No token"));
  }

  try {

    token = token.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);


    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Unauthorized - Invalid token"));
  }
});

io.on("connection", (socket) => {

  const userId = socket.user?.userId;

  if (userId) {

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socket.id);

    io.emit(
      "onlineUsers",
      Array.from(onlineUsers.keys())
    );

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
        !data?.receiver ||
        !data?.senderModel ||
        !data?.receiverModel ||
        !data?.text?.trim()
      ) {

        return;
      }

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

      const receiverId =
        receiver.userId.toString();

      const receiverInsideRoom =
        isUserInConversation(
          receiverId,
          data.conversationId
        );

      if (!receiverInsideRoom) {

        if (receiverType === "Lawyer") {

          await Conversation.findByIdAndUpdate(
            data.conversationId,
            {
              $inc: {
                "unreadCount.lawyer": 1,
              },
            }
          );

        } else {

          await Conversation.findByIdAndUpdate(
            data.conversationId,
            {
              $inc: {
                "unreadCount.client": 1,
              },
            }
          );
        }
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

  const isUserInConversation = (
    receiverId,
    conversationId
  ) => {

    const receiverSockets =
      onlineUsers.get(receiverId);

    if (!receiverSockets) return false;

    for (const socketId of receiverSockets) {

      const socketInstance =
        io.sockets.sockets.get(socketId);

      if (
        socketInstance &&
        socketInstance.rooms.has(
          conversationId
        )
      ) {
        return true;
      }
    }

    return false;
  };

  /* =========================
   CALL EVENTS
  ========================= */

  // CALL USER
  socket.on(
    "call-user",
    ({ to, from, callType }) => {

      console.log(
        "CALL USER:",
        from,
        "→",
        to
      );

      const receiverSockets =
        onlineUsers.get(to);

      if (!receiverSockets) {
        console.log("USER OFFLINE");
        return;
      }

      receiverSockets.forEach((socketId) => {

        io.to(socketId).emit(
          "incoming-call",
          {
            from,
            callType,
          }
        );
      });
    }
  );

  // REJECT CALL
  socket.on(
    "reject-call",
    ({ to }) => {

      const callerSockets =
        onlineUsers.get(to);

      if (!callerSockets) return;

      callerSockets.forEach((socketId) => {

        io.to(socketId).emit(
          "call-rejected"
        );
      });
    }
  );

  // END CALL
  socket.on(
    "end-call",
    ({ to }) => {

      const userSockets =
        onlineUsers.get(to);

      if (!userSockets) return;

      userSockets.forEach((socketId) => {

        io.to(socketId).emit(
          "call-ended"
        );
      });
    }
  );




  socket.on("disconnect", () => {
    const userId = socket.user?.userId;

    if (userId) {

      const userSockets =
        onlineUsers.get(userId);

      if (userSockets) {

        userSockets.delete(socket.id);

        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
        }
      }

      io.emit(
        "onlineUsers",
        Array.from(onlineUsers.keys())
      );

      console.log("ONLINE USERS:", onlineUsers);
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

