import Admin from "./admin.model.js";
import bcrypt from "bcryptjs";
import { generateTokens, hashToken } from "../../auth/auth.service.js";
import { setRefreshTokenCookie } from "../../../shared/utils/cookie.js";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select("+password +refreshToken");
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const { accessToken, refreshToken } = generateTokens(admin, "admin");

  admin.refreshToken = await hashToken(refreshToken);
  await admin.save();

  setRefreshTokenCookie(res, refreshToken);

  res.status(200).json({
    message: "Admin logged in successfully",
    accessToken,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
};