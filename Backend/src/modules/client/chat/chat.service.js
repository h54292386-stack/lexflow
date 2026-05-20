import {
  saveMessageRepo,
  getMessagesRepo,
  findConversationRepo,
  createConversationRepo,
  getUserConversationsRepo
} from "./chat.repository.js";
import Conversation from "./conversation.model.js"

export const saveMessageService = async (
  data
) => {

  return await saveMessageRepo(data);
};


// GET MESSAGES
export const getMessagesService = async (
  conversationId
) => {

  return await getMessagesRepo(
    conversationId
  );
};


// CREATE OR GET CONVERSATION
export const createOrGetConversationService =
  async (clientId, lawyerId) => {

    const ids = [
      clientId.toString(),
      lawyerId.toString(),
    ].sort();

    const conversationKey = ids.join("_");

    let conversation =
      await Conversation.findOne({
        conversationKey,
      });

    if (conversation) {
      return conversation;
    }

    conversation =
      await createConversationRepo({
        conversationKey,

        participants: [
          {
            userId: clientId,
            userType: "Client",
          },

          {
            userId: lawyerId,
            userType: "Lawyer",
          },
        ],
      });

    return conversation;
  };

  export const getUserConversationsService =
  async (userId) => {

    return await getUserConversationsRepo(
      userId
    );
  };