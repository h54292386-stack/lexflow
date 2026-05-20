import { asyncHandler } from "../../../shared/middleware/asyncHandler.js";

import { sendResponse } from "../../../shared/utils/response.js";

import {
  getMessagesService,
  createOrGetConversationService,
  getUserConversationsService
} from "./chat.service.js";


// GET MESSAGES
export const getMessages = asyncHandler(
  async (req, res) => {

    const { conversationId } = req.params;

    const messages =
      await getMessagesService(
        conversationId
      );

     return sendResponse(
    res,
    200,
    true,
    "Messages fetched successfully",
    { data: messages }
  );

  }
);


// CREATE OR GET CONVERSATION
export const createOrGetConversation =
  asyncHandler(
    async (req, res) => {

      const {
        clientId,
        lawyerId,
      } = req.body;

      const conversation =
        await createOrGetConversationService(
          clientId,
          lawyerId
        );

    return sendResponse(
      res,
      200,
      true,
      "Conversation fetched successfully",
      { data: conversation }
    );

    }
  );

  export const getUserConversations =
  asyncHandler(async (req, res) => {

    const { userId } = req.params;

    const conversations =
      await getUserConversationsService(
        userId
      );

 return sendResponse(
      res,
      200,
      true,
      "Conversations fetched successfully",
      { data: conversations }
    );
  });