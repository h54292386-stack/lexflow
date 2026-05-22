import {
  getClientProfileService,
  updateClientProfileService,
  changePasswordService,
} from "./profile.service.js";
import Client from "../auth/client.model.js";
import { asyncHandler } from "../../../shared/middleware/asyncHandler.js";

import AppError from "../../../shared/utils/AppError.js";

import { sendResponse } from "../../../shared/utils/response.js";


// GET PROFILE
export const getClientProfileController = asyncHandler(
  async (req, res) => {

    const client = await getClientProfileService(
      req.user.id
    );

    if (!client) {
      throw new AppError("Client not found", 404);
    }

    sendResponse(
      res,
      200,
      true,
      "Profile fetched successfully",
      {
        user: client,
      }
    );
  }
);


// UPDATE PROFILE
export const updateClientProfileController =
  asyncHandler(async (req, res) => {

    const updatedClient =
      await updateClientProfileService(
        req.user.id,
        req.body
      );

    sendResponse(
      res,
      200,
      true,
      "Profile updated successfully",
      {
        user: updatedClient,
      }
    );
  });


// CHANGE PASSWORD
export const changePasswordController =
  asyncHandler(async (req, res) => {

    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError(
        "All fields are required",
        400
      );
    }

    await changePasswordService(
      req.user.id,
      currentPassword,
      newPassword
    );

    sendResponse(
      res,
      200,
      true,
      "Password changed successfully"
    );
  });

  export const uploadProfileImageController = asyncHandler(async (req, res) => {

  if (!req.file) {
    throw new AppError("Image is required", 400);
  }

  const imageUrl = req.file.path; // Cloudinary URL

  const updatedUser = await Client.findByIdAndUpdate(
    req.user.id,
    { profileImage: imageUrl },
    { new: true }
  );

  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }

  sendResponse(res, 200, true, "Profile image updated successfully", {
    user: updatedUser
  });
});