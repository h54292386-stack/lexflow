import express from "express";

import {
  getLawyerProfileController,
  updateLawyerProfileController,
  changeLawyerPasswordController,
  uploadLawyerProfileImageController,
} from "./profile.controller.js";

import { authenticateUser } from "../../../shared/middleware/auth.middleware.js";
import { upload } from "../../../shared/utils/multer.js";
import { authorizeRoles } from "../../../shared/middleware/authorizeRoles.js";

const router = express.Router();
router.use(authenticateUser);
router.use(authorizeRoles("lawyer"));

router.get(
  "/profile",
  getLawyerProfileController
);

router.put(
  "/profile",
  updateLawyerProfileController
);

router.put(
  "/change-password",
  changeLawyerPasswordController
);

router.put(
  "/profile/image",
  upload.single("image"),
  uploadLawyerProfileImageController
);

export default router;