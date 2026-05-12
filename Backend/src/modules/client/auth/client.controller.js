import { registerClient, loginClient } from "./client.service.js";
import { sendResponse } from "../../../shared/utils/response.js";
import { setRefreshTokenCookie } from "../../../shared/utils/cookie.js";
import { asyncHandler } from "../../../shared/middleware/asyncHandler.js";
import { verifyGoogleToken } from "../../auth/auth.google.service.js";
import { createClient, findClientByEmail } from "./client.repository.js";
import { generateTokens, hashToken } from "../../auth/auth.service.js";
import { sendOTP } from "../../../shared/utils/sendEmail.js";
import AppError from "../../../shared/utils/AppError.js";
import Client from "./client.model.js";
import bcrypt from "bcryptjs";


export const registerClientController = asyncHandler(async (req, res) => {

  const client = await registerClient(req.body || {});

  sendResponse(res, 201, true, "OTP sent to email", {
    data: client
  });
});


export const resendOTPController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("Email is required", 400);
  }

  const emailNormalized = email.toLowerCase().trim();

  const user = await Client.findOne({ email: emailNormalized });

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

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
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

  const user = await Client.findOne({ email: emailNormalized }).select("+otp");

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

  const { accessToken, refreshToken } = generateTokens(user, user.role);

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
      role: user.role,
    },
  });
});


export const loginClientController = asyncHandler(async (req, res) => {
  const result = await loginClient(req.body || {});

  setRefreshTokenCookie(res, result.refreshToken);

  sendResponse(res, 200, true, "Login successful", {
    accessToken: result.accessToken,
    user: result.user
  });
});


export const googleLoginClient = asyncHandler(async (req, res) => {
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

  let client = await findClientByEmail(emailNormalized);

  if (client && client.provider === "local") {
    throw new AppError("Use email/password login", 400);
  }

  if (
    client &&
    client.provider === "google" &&
    client.googleId &&
    client.googleId !== sub
  ) {
    throw new AppError("Google account mismatch", 401);
  }

  if (client && !client.isActive) {
    throw new AppError("Account is inactive", 403);
  }

  if (client && !client.googleId) {
    client.googleId = sub;
    client.provider = "google";
    await client.save();
  }

  if (!client) {
    client = await createClient({
      name,
      email: emailNormalized,
      provider: "google",
      googleId: sub,
      profileImage: picture
    });
  }

  const { accessToken, refreshToken } = generateTokens(client, "client");

  client.refreshToken = await hashToken(refreshToken);
  await client.save();

  setRefreshTokenCookie(res, refreshToken);

  sendResponse(res, 200, true, "Google login successful", {
    accessToken,
    user: {
      id: client._id,
      name: client.name,
      email: client.email,
      role: "client",
      profileImage: client.profileImage
    }
  });
});


export const getClientProfile = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.user.id).select("-password");

  if (!client) {
    throw new AppError("Client not found", 404);
  }

  res.status(200).json({
    user: client,
  });
});

export const logoutClientController = asyncHandler(async (req, res) => {
  const client = req.user;

  await Client.updateOne(
    { _id: client.id },
    { $unset: { refreshToken: "" } }
  );

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });

  sendResponse(res, 200, true, "Logged out successfully");
});