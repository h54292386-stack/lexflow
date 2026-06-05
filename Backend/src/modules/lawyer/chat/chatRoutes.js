import express from "express";
import {
  getMessages,
  createOrGetConversation,
  getUserConversations,
} from "../../client/chat/chat.controller.js";

import { authenticateUser } from "../../../shared/middleware/auth.middleware.js";
import { authorizeRoles } from "../../../shared/middleware/authorizeRoles.js";

const router = express.Router();

router.use(authenticateUser);
router.use(authorizeRoles("lawyer"));

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