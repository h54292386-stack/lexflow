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
import { authorizeRoles } from "../../../shared/middleware/authorizeRoles.js";


const router = express.Router();
router.use(authenticateUser);
router.use(authorizeRoles("admin"));

router.get(
  "/pending",
  requireAdmin,
  getPendingLawyersController
);

router.put(
  "/:id/approve",
  requireAdmin,
  approveLawyerController
);

router.put(
  "/:id/reject",
  requireAdmin,
  rejectLawyerController
);

export default router;