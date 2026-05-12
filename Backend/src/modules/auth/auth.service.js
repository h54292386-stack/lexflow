import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const generateTokens = (user, role) => {
  const accessToken = jwt.sign(
    {
      userId: user._id,
      role
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    {
      userId: user._id,
      role
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};


export const hashToken = async (token) => {
  return await bcrypt.hash(token, 10);
};


export const compareToken = async (raw, hashed) => {
  return await bcrypt.compare(raw, hashed);
};