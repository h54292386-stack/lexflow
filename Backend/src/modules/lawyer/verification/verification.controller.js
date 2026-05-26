import { asyncHandler } from "../../../shared/middleware/asyncHandler.js";

import { sendResponse } from "../../../shared/utils/response.js";

import {
  submitVerificationService,
} from "./verification.service.js";

export const submitVerificationController =
  asyncHandler(async (req, res) => {

    const result =
      await submitVerificationService(
        req.user.id,
        req.body,
        req.files
      );

    sendResponse(
      res,
      200,
      true,
      "Verification submitted successfully",
      result
    );
  });