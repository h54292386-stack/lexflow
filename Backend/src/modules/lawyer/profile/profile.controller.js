import Lawyer from "../auth/lawyer.model.js";

import {
  getLawyerProfileService,
  updateLawyerProfileService,
  changeLawyerPasswordService,
} from "./profile.service.js";

import { asyncHandler } from "../../../shared/middleware/asyncHandler.js";
import AppError from "../../../shared/utils/AppError.js";
import { sendResponse } from "../../../shared/utils/response.js";


// GET PROFILE
export const getLawyerProfileController = asyncHandler(
  async (req, res) => {

    const lawyer = await getLawyerProfileService(
      req.user.id
    );

    if (!lawyer) {
      throw new AppError("Lawyer not found", 404);
    }

    sendResponse(
      res,
      200,
      true,
      "Profile fetched successfully",
      {
        user: lawyer,
      }
    );
  }
);


// UPDATE PROFILE
export const updateLawyerProfileController =
  asyncHandler(async (req, res) => {

    const updatedLawyer =
      await updateLawyerProfileService(
        req.user.id,
        req.body
      );

    sendResponse(
      res,
      200,
      true,
      "Profile updated successfully",
      {
        user: updatedLawyer,
      }
    );
  });


// CHANGE PASSWORD
export const changeLawyerPasswordController =
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

    await changeLawyerPasswordService(
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


// UPLOAD PROFILE IMAGE
export const uploadLawyerProfileImageController =
  asyncHandler(async (req, res) => {

    if (!req.file) {
      throw new AppError("Image is required", 400);
    }

    const imageUrl = req.file.path;

    const updatedLawyer =
      await Lawyer.findByIdAndUpdate(
        req.user.id,
        { profileImage: imageUrl },
        { new: true }
      );

    if (!updatedLawyer) {
      throw new AppError("Lawyer not found", 404);
    }

    sendResponse(
      res,
      200,
      true,
      "Profile image updated successfully",
      {
        user: updatedLawyer
      }
    );
  });