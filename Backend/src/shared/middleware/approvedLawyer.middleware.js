import AppError from "../utils/AppError.js";

export const requireApprovedLawyer = (req, res, next) => {
  if (req.user.verificationStatus !== "approved") {
    return next(new AppError("Complete verification first", 403));
  }
  next();
};