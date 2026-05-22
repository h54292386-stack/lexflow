import bcrypt from "bcryptjs";
import AppError from "../../../shared/utils/AppError.js";

import {
  getClientProfileRepo,
  updateClientProfileRepo,
  getClientWithPasswordRepo,
} from "./profile.repository.js";


// GET PROFILE
export const getClientProfileService = async (
  clientId
) => {

  return await getClientProfileRepo(clientId);
};


// UPDATE PROFILE
export const updateClientProfileService = async (
  clientId,
  data
) => {

  const allowedUpdates = [
    "name",
    "email",
    "phone",
    "alternatePhone",
    "gender",
    "dateOfBirth",
    "address",
    "profileImage",
  ];

  const filteredData = {};

  allowedUpdates.forEach((field) => {

    if (data[field] !== undefined) {
      filteredData[field] = data[field];
    }

  });

  const existingUser =
    await getClientProfileRepo(clientId);

  if (!existingUser) {
    throw new AppError(
      "User not found",
      404
    );
  }

  const mergedData = {
    ...existingUser.toObject(),
    ...filteredData,
  };

  const requiredFields = [
    "phone",
    "gender",
    "dateOfBirth",
  ];

  const isProfileComplete =
    requiredFields.every(
      (field) => mergedData[field]
    ) &&
    mergedData.address?.houseFlatNo &&
    mergedData.address?.street &&
    mergedData.address?.city &&
    mergedData.address?.state &&
    mergedData.address?.pinCode &&
    mergedData.address?.country;

  if (isProfileComplete) {
    filteredData.profileCompleted = true;
  }

  return await updateClientProfileRepo(
    clientId,
    filteredData
  );
};


// CHANGE PASSWORD
export const changePasswordService = async (
  clientId,
  currentPassword,
  newPassword
) => {

  const client =
    await getClientWithPasswordRepo(clientId);

  if (!client) {
    throw new AppError(
      "User not found",
      404
    );
  }

  // CHECK CURRENT PASSWORD
  const isMatch = await bcrypt.compare(
    currentPassword,
    client.password
  );

  if (!isMatch) {
    throw new AppError(
      "Current password is incorrect",
      400
    );
  }

  // PREVENT SAME PASSWORD
  const isSamePassword =
    await bcrypt.compare(
      newPassword,
      client.password
    );

  if (isSamePassword) {
    throw new AppError(
      "New password cannot be same as current password",
      400
    );
  }

  // SAVE NEW PASSWORD
  client.password = newPassword;

  await client.save();

  return true;
};