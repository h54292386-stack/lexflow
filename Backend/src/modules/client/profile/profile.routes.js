import express from "express";

import {
  getClientProfileController,
  updateClientProfileController,
  changePasswordController,
  uploadProfileImageController
} from "./profile.controller.js";
import { upload } from "../../../shared/utils/multer.js";
import { authenticateUser } from "../../../shared/middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/profile",
  authenticateUser,
  getClientProfileController
);

router.put(
  "/profile",
  authenticateUser,
  updateClientProfileController
);

router.put(
  "/change-password",
  authenticateUser,
  changePasswordController
);

router.put(
  "/profile/image",
  authenticateUser,
  upload.single("image"),
  uploadProfileImageController
);

export default router;