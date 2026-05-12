import { registerLawyer, loginLawyer } from "./lawyer.service.js";
import { sendResponse } from "../../../shared/utils/response.js";
import { setRefreshTokenCookie } from "../../../shared/utils/cookie.js";
import { asyncHandler } from "../../../shared/middleware/asyncHandler.js";
import AppError from "../../../shared/utils/AppError.js";
import Lawyer from "./lawyer.model.js";
import { verifyGoogleToken } from "../../auth/auth.google.service.js";
import { createLawyer, findLawyerForAuth, findLawyerByEmail } from "./lawyer.repository.js";
import { generateTokens, hashToken } from "../../auth/auth.service.js";
import { sendOTP } from "../../../shared/utils/sendEmail.js";
import bcrypt from "bcryptjs";
import { generateOTP } from "../../../shared/utils/otp.js";
import { submitLawyerDocuments } from "./lawyer.service.js";

export const registerLawyerController = asyncHandler(async (req, res) => {
    console.log("REGISTER API HIT");  // 👈 ADD THIS

  const lawyer = await registerLawyer(req.body || {});

  sendResponse(res, 201, true, "Lawyer registered successfully", {
    data: lawyer
  });
});

export const resendOTPController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("Email is required", 400);
  }

  const emailNormalized = email.toLowerCase().trim();

const user = await Lawyer.findOne({ email: emailNormalized }).select("+otp");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isVerified) {
    throw new AppError("User already verified", 400);
  }

  if (user.otpLastSentAt && Date.now() - user.otpLastSentAt < 60000) {
    throw new AppError("Please wait before requesting OTP again", 429);
  }

  if (user.otpRequestCount >= 5) {
    throw new AppError("Maximum OTP requests reached", 429);
  }

  const otp = generateOTP()
  const hashedOtp = await bcrypt.hash(otp, 10);

  user.otp = hashedOtp;
  user.otpExpires = Date.now() + 5 * 60 * 1000;

  user.otpLastSentAt = Date.now();
  user.otpRequestCount += 1;

  await user.save();

  await sendOTP(user.email, otp);

  sendResponse(res, 200, true, "OTP resent successfully");
});

export const verifyOTPController = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new AppError("Email and OTP are required", 400);
  }

  const emailNormalized = email.toLowerCase().trim();

  const user = await Lawyer.findOne({ email: emailNormalized }).select("+otp");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isVerified) {
    throw new AppError("User already verified", 400);
  }

  if (user.otpBlockedUntil && user.otpBlockedUntil > Date.now()) {
    throw new AppError("Too many attempts. Try again later.", 429);
  }

  if (user.otpAttempts >= 5) {
    user.otpBlockedUntil = Date.now() + 10 * 60 * 1000;
    await user.save();
    throw new AppError("Too many failed attempts. Try again later.", 429);
  }

  if (!user.otp || !user.otpExpires) {
    throw new AppError("No OTP found. Please request again.", 400);
  }

  if (user.otpExpires < Date.now()) {
    throw new AppError("OTP expired", 400);
  }

  const isMatch = await bcrypt.compare(otp, user.otp);

  if (!isMatch) {
    user.otpAttempts += 1;
    await user.save();
    throw new AppError("Invalid OTP", 400);
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  user.otpAttempts = 0;
  user.otpBlockedUntil = undefined;
  user.otpRequestCount = 0;

  const { accessToken, refreshToken } = generateTokens(user, "lawyer");

  user.refreshToken = await hashToken(refreshToken);
  await user.save();

  setRefreshTokenCookie(res, refreshToken);

  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: "lawyer",
    },
  });
});


export const googleLoginLawyer = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new AppError("Google token is required", 400);
  }

  let payload;

  try {
    payload = await verifyGoogleToken(token);
  } catch {
    throw new AppError("Invalid Google token", 401);
  }

  const { email, name, sub, picture, email_verified } = payload;

  if (!email || !email_verified) {
    throw new AppError("Google email not verified", 401);
  }

  const emailNormalized = email.toLowerCase().trim();

  let lawyer = await findLawyerByEmail(emailNormalized);

  if (lawyer && lawyer.provider === "local") {
    throw new AppError("Use email/password login", 400);
  }

  if (
    lawyer &&
    lawyer.provider === "google" &&
    lawyer.googleId &&
    lawyer.googleId !== sub
  ) {
    throw new AppError("Google account mismatch", 401);
  }

  if (lawyer && !lawyer.isActive) {
    throw new AppError("Account is inactive", 403);
  }

  if (lawyer && !lawyer.googleId) {
    lawyer.googleId = sub;
    lawyer.provider = "google";
    await lawyer.save();
  }

  if (!lawyer) {
    lawyer = await createLawyer({
      name,
      email: emailNormalized,
      provider: "google",
      googleId: sub,
      profileImage: picture
    });
  }

  const { accessToken, refreshToken } = generateTokens(lawyer, "lawyer");

  lawyer.refreshToken = await hashToken(refreshToken);
  await lawyer.save();

  setRefreshTokenCookie(res, refreshToken);

  sendResponse(res, 200, true, "Google login successful", {
    accessToken,
    user: {
      id: lawyer._id,
      name: lawyer.name,
      email: lawyer.email,
      role: "lawyer",
      profileImage: lawyer.profileImage
    }
  });
});


export const loginLawyerController = asyncHandler(async (req, res) => {
  const result = await loginLawyer(req.body || {});

  setRefreshTokenCookie(res, result.refreshToken);

  sendResponse(res, 200, true, "Lawyer login successful", {
    accessToken: result.accessToken,
    lawyer: result.lawyer
  });
});


export const submitDocumentsController = asyncHandler(async (req, res) => {
  const lawyerId = req.user._id;

  const lawyer = await submitLawyerDocuments(lawyerId, req.body);

  sendResponse(res, 200, true, "Documents submitted successfully", {
    data: lawyer
  });
});


export const logoutLawyerController = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("User not authenticated", 401);
  }

  const lawyer = req.user;

  lawyer.refreshToken = null;
  await lawyer.save({ validateBeforeSave: false });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0

  });

  sendResponse(res, 200, true, "Logged out successfully");
});

