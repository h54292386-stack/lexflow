import mongoose from "mongoose";
import Message from "./chat.model.js";
import Conversation from "./conversation.model.js";
import Lawyer from "../../lawyer/auth/lawyer.model.js";
import Client from "../auth/client.model.js";


// SAVE MESSAGE
export const saveMessageRepo = async (data) => {

  return await Message.create(data);
};


// GET ALL MESSAGES
export const getMessagesRepo = async (
  conversationId
) => {

  return await Message.find({
    conversationId,
  })
    .populate("sender")
    .populate("receiver")
    .sort({ createdAt: 1 });
};

// CREATE CONVERSATION
export const createConversationRepo = async (
  data
) => {

  return await Conversation.create(data);
};
export const getUserConversationsRepo = async (userId) => {

  const conversations = await Conversation.find({
    "participants.userId": userId,
  })
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  for (const conv of conversations) {

    for (const participant of conv.participants) {

      if (participant.userType === "Client") {

        const client = await Client.findById(
          participant.userId
        );

        participant.userId = client;

      } else if (participant.userType === "Lawyer") {

        const lawyer = await Lawyer.findById(
          participant.userId
        );

        participant.userId = lawyer;
      }

    }
  }

  return conversations;
};


export const findConversationByKeyRepo = async (
  conversationKey
) => {

  return await Conversation.findOne({
    conversationKey,
  }).populate("latestMessage");
};