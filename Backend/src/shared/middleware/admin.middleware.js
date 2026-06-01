import AppError from "../utils/AppError.js";

export const requireAdmin = (
  req,
  res,
  next
) => {

  if (!req.user) {
    throw new AppError(
      "Authentication required",
      401
    );
  }

  if (req.user.role !== "admin") {
    throw new AppError(
      "Admin access only",
      403
    );
  }

  next();
};