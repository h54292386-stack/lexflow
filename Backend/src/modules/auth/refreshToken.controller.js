import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Client from "../client/auth/client.model.js";
import Lawyer from "../lawyer/auth/lawyer.model.js";
import { asyncHandler } from "../../shared/middleware/asyncHandler.js";
import { sendResponse } from "../../shared/utils/response.js";
import { setRefreshTokenCookie } from "../../shared/utils/cookie.js";
import { generateTokens, hashToken } from "./auth.service.js";
import AppError from "../../shared/utils/AppError.js";

const findUser = async (userId) => {
    let user = await Client.findById(userId).select("+refreshToken");

    if (!user) {
        user = await Lawyer.findById(userId).select("+refreshToken");
    }

    return user;
};

export const refreshTokenController = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new AppError("Refresh token missing", 401);
  }

  let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        throw new AppError("Invalid refresh token", 401);
    }

  const user = await findUser(decoded.userId);

  if (!user || !user.refreshToken) {
        throw new AppError("User not found", 404);
  }

  const isValid = await bcrypt.compare(token, user.refreshToken);

  if (!isValid) {
        throw new AppError("Refresh token reuse detected", 401);
  }

  const { accessToken, refreshToken: newRefreshToken } =
    generateTokens(user, user.role);

  user.refreshToken = await hashToken(newRefreshToken);
  await user.save();

  setRefreshTokenCookie(res, newRefreshToken);

  return res.json({
    success: true,
    accessToken,
  });
});