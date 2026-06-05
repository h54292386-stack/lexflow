import jwt from "jsonwebtoken";
import Client from "../../modules/client/auth/client.model.js";
import Lawyer from "../../modules/lawyer/auth/lawyer.model.js";
import Admin from "../../modules/admin/auth/admin.model.js";
import { asyncHandler } from "./asyncHandler.js";
import AppError from "../utils/AppError.js";

const findUserById = async (id) => {

  let user = await Client.findById(id).select("-password");

  if (!user) {
    user = await Lawyer.findById(id).select("-password");
  }
  if (!user) {
    user = await Admin.findById(id).select("-password");
  }
  
  return user;
};

export const authenticateUser = asyncHandler(async (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Access token missing or invalid format", 401);
  }

  const token = authHeader.split(" ")[1];

  let decoded;

  try {

    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (err) {

    throw new AppError("Invalid or expired access token", 401);

  }

  const user = await findUserById(decoded.userId);

  if (!user) {
    throw new AppError("User no longer exists", 401);

  }

  if (!user.isActive) {
    throw new AppError("Your account has been blocked", 403);
  }

  req.user = {
    _id: user._id,
    id: user._id,
    role: user.role || decoded.role,
    verificationStatus: user.verificationStatus,
    isApproved: user.isApproved
  };
  next();

});

