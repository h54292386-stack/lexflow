import bcrypt from "bcryptjs";
import { createClient, findClientByEmail,findClientByEmailForLogin } from "./client.repository.js";
import { generateTokens, hashToken } from "../../auth/auth.service.js";
import AppError from "../../../shared/utils/AppError.js";
import { generateOTP } from "../../../shared/utils/otp.js";
import { sendOTP } from "../../../shared/utils/sendEmail.js";



const normalizeEmail = (email) => {
  if (!email) throw new AppError("Email is required", 400);
  return email.toLowerCase().trim();
};


const validatePassword = (password) => {
  if (!password) {
    throw new AppError("Password is required", 400);
  }

  if (password.length < 9) {
    throw new AppError("Password must be at least 9 characters", 400);
  }

  if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{9,}$/.test(password)) {
    throw new AppError(
      "Password must contain letters, numbers, and special characters",
      400
    );
  }
};


export const registerClient = async (data = {}) => {
  
  let { name, email, password } = data;

  if (!name) {
    throw new AppError("Name is required", 400);
  }

  email = normalizeEmail(email);
  validatePassword(password);

  const existingClient = await findClientByEmail(email);

   if (existingClient?.isVerified) {
    throw new AppError("User already verified", 409);
  }

    if (existingClient && !existingClient.isVerified) {
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    existingClient.otp = hashedOTP;
    existingClient.otpExpires = Date.now() + 5 * 60 * 1000;

    await existingClient.save();
    await sendOTP(email, otp);

    return {
  success: true,
  message: "OTP resent to email",
  data: {
    email
  }
};
  }

  const otp = generateOTP();

  const hashedOTP = await bcrypt.hash(otp, 10);
  
  const newClient = await createClient({
    name,
    email,
    password,
    otp: hashedOTP,
    otpExpires: Date.now() + 5 * 60 * 1000,
    isVerified: false
  });

  await sendOTP(email, otp);
 return {
  success: true,
  message: "OTP sent to email",
  data: {
    email: newClient.email
  }
};
};


export const loginClient = async (data = {}) => {
  let { email, password } = data;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  email = normalizeEmail(email);

  const client = await findClientByEmailForLogin(email);

  if (!client) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!client.isActive) {
    throw new AppError("Account is inactive", 403);
  }

  const isMatch = await bcrypt.compare(password, client.password);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const { accessToken, refreshToken } = generateTokens(client, client.role);

  client.refreshToken = await hashToken(refreshToken);
  await client.save();

  return {
    accessToken,
    refreshToken,
    user: {
      id: client._id,
      name: client.name,
      email: client.email,
      role: client.role
    }
  };
};