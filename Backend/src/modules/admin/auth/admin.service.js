import bcrypt from "bcryptjs";

import AppError from "../../../shared/utils/AppError.js";

import {
  findAdminByEmail,
  createAdmin,
} from "./admin.repository.js";

export const registerAdminService =
  async ({
    name,
    email,
    password,
  }) => {

    const emailNormalized =
      email.toLowerCase().trim();

    const existingAdmin =
      await findAdminByEmail(
        emailNormalized
      );

    if (existingAdmin) {
      throw new AppError(
        "Admin already exists",
        409
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const admin =
      await createAdmin({
        name,
        email: emailNormalized,
        password: hashedPassword,
      });

    return admin;
  };