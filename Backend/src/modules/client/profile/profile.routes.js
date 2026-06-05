import express from "express";

import {
  getClientProfileController,
  updateClientProfileController,
  changePasswordController,
  uploadProfileImageController
} from "./profile.controller.js";
import { upload } from "../../../shared/utils/multer.js";
import { authenticateUser } from "../../../shared/middleware/auth.middleware.js";
import { authorizeRoles } from "../../../shared/middleware/authorizeRoles.js";

const router = express.Router();

router.use(authenticateUser);
router.use(authorizeRoles("client"));

router.get(
  "/profile",
  getClientProfileController
);

router.put(
  "/profile",
  updateClientProfileController
);

router.put(
  "/change-password",
  changePasswordController
);

router.put(
  "/profile/image",
  upload.single("image"),
  uploadProfileImageController
);

export default router;