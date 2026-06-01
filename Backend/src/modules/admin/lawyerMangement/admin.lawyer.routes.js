import express from "express";

import {
  getPendingLawyersController,
  approveLawyerController,
  rejectLawyerController,
} from "./admin.lawyer.controller.js";

import {
  authenticateUser
} from "../../../shared/middleware/auth.middleware.js";

import {
  requireAdmin
} from "../../../shared/middleware/admin.middleware.js";


const router = express.Router();

router.get(
  "/pending",
  authenticateUser,
  requireAdmin,
  getPendingLawyersController
);

router.put(
  "/:id/approve",
  authenticateUser,
  requireAdmin,
  approveLawyerController
);

router.put(
  "/:id/reject",
  authenticateUser,
  requireAdmin,
  rejectLawyerController
);

export default router;