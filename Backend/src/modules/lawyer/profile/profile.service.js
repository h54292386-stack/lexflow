import bcrypt from "bcryptjs";
import AppError from "../../../shared/utils/AppError.js";

import {
  getLawyerProfileRepo,
  updateLawyerProfileRepo,
  getLawyerWithPasswordRepo,
} from "./profile.repository.js";


// GET PROFILE
export const getLawyerProfileService = async (
  lawyerId
) => {
  return await getLawyerProfileRepo(lawyerId);
};


// UPDATE PROFILE
export const updateLawyerProfileService = async (
  lawyerId,
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
  "officeAddress",   
  "profileImage",
  "about",
  "education",
  "specialization",
  "experience",
  "languages",
];

  const filteredData = {};

  allowedUpdates.forEach((field) => {
    if (data[field] !== undefined) {
      filteredData[field] = data[field];
    }
  });

  const existingLawyer =
    await getLawyerProfileRepo(lawyerId);

  if (!existingLawyer) {
    throw new AppError(
      "Lawyer not found",
      404
    );
  }

  const mergedData = {
    ...existingLawyer.toObject(),
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
    mergedData.officeAddress?.officeName &&
    mergedData.officeAddress?.street &&
    mergedData.officeAddress?.city &&
    mergedData.officeAddress?.state &&
    mergedData.officeAddress?.pinCode &&
    mergedData.officeAddress?.country;

if (isProfileComplete) {
  filteredData.profileCompleted = true;
} else {
  filteredData.profileCompleted = false;
}

  return await updateLawyerProfileRepo(
    lawyerId,
    filteredData
  );
};


// CHANGE PASSWORD
export const changeLawyerPasswordService = async (
  lawyerId,
  currentPassword,
  newPassword
) => {

  const lawyer =
    await getLawyerWithPasswordRepo(lawyerId);

  if (!lawyer) {
    throw new AppError(
      "Lawyer not found",
      404
    );
  }

  const isMatch = await bcrypt.compare(
    currentPassword,
    lawyer.password
  );

  if (!isMatch) {
    throw new AppError(
      "Current password is incorrect",
      400
    );
  }

  const isSamePassword =
    await bcrypt.compare(
      newPassword,
      lawyer.password
    );

  if (isSamePassword) {
    throw new AppError(
      "New password cannot be same as current password",
      400
    );
  }

  lawyer.password = newPassword;

  await lawyer.save();

  return true;
};