import express from "express";

import {
  getMessages,
  createOrGetConversation,
  getUserConversations
} from "./chat.controller.js";

const router = express.Router();


// CREATE/GET CONVERSATION
router.post(
  "/conversation",
  createOrGetConversation
);

router.get(
  "/conversations/:userId",
  getUserConversations
);

router.get(
  "/:conversationId",
  getMessages
);


export default router;