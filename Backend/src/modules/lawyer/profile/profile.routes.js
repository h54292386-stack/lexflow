import express from "express";

import {
  getLawyerProfileController,
  updateLawyerProfileController,
  changeLawyerPasswordController,
  uploadLawyerProfileImageController,
} from "./profile.controller.js";

import { authenticateUser } from "../../../shared/middleware/auth.middleware.js";
import { upload } from "../../../shared/utils/multer.js";

const router = express.Router();

router.get(
  "/profile",
  authenticateUser,
  getLawyerProfileController
);

router.put(
  "/profile",
  authenticateUser,
  updateLawyerProfileController
);

router.put(
  "/change-password",
  authenticateUser,
  changeLawyerPasswordController
);

router.put(
  "/profile/image",
  authenticateUser,
  upload.single("image"),
  uploadLawyerProfileImageController
);

export default router;