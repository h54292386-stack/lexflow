import bcrypt from "bcryptjs";
import { createLawyer, findLawyerForAuth, findLawyerByEmail ,  findLawyerById } from "./lawyer.repository.js";
import AppError from "../../../shared/utils/AppError.js";
import { generateTokens, hashToken } from "../../auth/auth.service.js";
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



export const registerLawyer = async (data = {}) => {
  let { name, email, password, barCouncilNumber, ...rest } = data;

  if (!name) {
    throw new AppError("Name is required",400);
  }

 email = normalizeEmail(email);
  validatePassword(password);

  const existingLawyer = await findLawyerByEmail(email);
  if (existingLawyer) {
    throw new AppError("Lawyer already exists",409);
  }

  if (!barCouncilNumber) {
    throw new AppError("Bar Council Number is required", 400);
  }


  const otp = generateOTP();
  const hashedOTP = await bcrypt.hash(otp, 10);


  const hashedPassword = await bcrypt.hash(password, 10);

  const newLawyer = await createLawyer({
    name,
    email,
    password: hashedPassword,
    barCouncilNumber,  
    otp: hashedOTP,
    otpExpires: Date.now() + 5 * 60 * 1000,
    isVerified: false,
    verificationStatus: "pending",
    ...rest
  });


 await sendOTP(email, otp);

  return {
    message: "OTP sent to email",
    email: newLawyer.email
  };
};


export const loginLawyer = async (data = {}) => {
  let { email, password } = data;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  email = email.toLowerCase().trim();

  const lawyer = await findLawyerForAuth(email);

  if (!lawyer) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!lawyer.isActive) {
    throw new AppError("Account is inactive", 403);
  }

  const isMatch = await bcrypt.compare(password, lawyer.password);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const { accessToken, refreshToken } = generateTokens(lawyer, "lawyer");
  
  lawyer.refreshToken = await hashToken(refreshToken);
  await lawyer.save({ validateBeforeSave: false });

  return {
    accessToken,
    refreshToken,
    lawyer: {
      id: lawyer._id,
      name: lawyer.name,
      email: lawyer.email,
      role: "lawyer",
      verificationStatus: lawyer.verificationStatus
    }
  };
};


export const submitLawyerDocuments = async (lawyerId, data) => {
  const { barCertificate, enrollmentCertificate, idProof } = data;

  if (!barCertificate || !enrollmentCertificate || !idProof) {
    throw new AppError("All documents are required", 400);
  }

  const lawyer = await findLawyerById(lawyerId);

  if (!lawyer) {
    throw new AppError("Lawyer not found", 404);
  }

  lawyer.documents = {
    barCertificate,
    enrollmentCertificate,
    idProof
  };

  lawyer.verificationStatus = "pending";

  await lawyer.save();

  return lawyer;
};