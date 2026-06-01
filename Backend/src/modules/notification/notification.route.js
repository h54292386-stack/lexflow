import express from "express";

import {
  getNotificationsController,
  markNotificationReadController,
  markAllNotificationsReadController,
} from "./notification.controller.js";

import { authenticateUser } from "../../shared/middleware/auth.middleware.js";

const router =
  express.Router();

router.get(
  "/",
  authenticateUser,
  getNotificationsController
);

router.patch(
  "/:id/read",
  authenticateUser,
  markNotificationReadController
);

router.patch(
  "/mark-all-read",
  authenticateUser,
  markAllNotificationsReadController
);


export default router;