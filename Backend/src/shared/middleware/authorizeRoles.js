export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {

    const userRole = req.user?.role;

    if (!userRole) {
      const error = new Error("User role not found");
      error.statusCode = 401;
      return next(error);
    }

    if (!allowedRoles.includes(userRole)) {
      console.log("ROLE CHECK FAILED");

      const error = new Error("Access denied: insufficient permissions");
      error.statusCode = 403;
      return next(error);
    }

    next();
  };
};