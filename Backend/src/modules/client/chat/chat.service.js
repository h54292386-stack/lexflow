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
      })
        .populate("participants.userId")
        .populate("latestMessage");

    if (conversation) {
      return conversation;
    }

    const newConversation =
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

    conversation = await Conversation.findById(
      newConversation._id
    )
      .populate("participants.userId")
      .populate("latestMessage");

    return conversation;
  };

  export const getUserConversationsService =
  async (userId) => {

    return await getUserConversationsRepo(
      userId
    );
  };