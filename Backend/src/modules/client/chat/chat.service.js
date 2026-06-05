import {
  saveMessageRepo,
  getMessagesRepo,
  createConversationRepo,
  getUserConversationsRepo,
  findConversationByKeyRepo
} from "./chat.repository.js";

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
      await findConversationByKeyRepo(
        conversationKey
      );
      

    if (conversation) {

      const conversations =
        await getUserConversationsRepo(clientId);

      return conversations.find(
        (c) => c._id.toString() === conversation._id.toString()
      );
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

    const conversations =
      await getUserConversationsRepo(clientId);

    return conversations.find(
      (c) =>
        c._id.toString() ===
        newConversation._id.toString()
    );
  };

export const getUserConversationsService =
  async (userId) => {

    return await getUserConversationsRepo(
      userId
    );
  };