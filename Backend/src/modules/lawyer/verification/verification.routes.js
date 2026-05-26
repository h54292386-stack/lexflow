import express from "express";

import {
  submitVerificationController,
} from "./verification.controller.js";

import { authenticateUser } from "../../../shared/middleware/auth.middleware.js";

import { upload } from "../../../shared/utils/multer.js";

const router = express.Router();

router.put(
  "/submit",
  authenticateUser,

  upload.fields([
    {
      name: "barCertificate",
      maxCount: 1,
    },

    {
      name: "enrollmentCertificate",
      maxCount: 1,
    },

    {
      name: "idProof",
      maxCount: 1,
    },

    {
      name: "additionalDocuments",
      maxCount: 5,
    },
  ]),

  submitVerificationController
);

export default router;