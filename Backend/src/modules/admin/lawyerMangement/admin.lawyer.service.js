import AppError from "../../../shared/utils/AppError.js";

import {
  findPendingLawyers,
  findLawyerById,
  saveLawyer,
} from "./admin.lawyer.repository.js";

export const getPendingLawyersService =
  async () => {
    return await findPendingLawyers();
  };

export const approveLawyerService =
  async (lawyerId) => {

    const lawyer =
      await findLawyerById(
        lawyerId
      );

    if (!lawyer) {
      throw new AppError(
        "Lawyer not found",
        404
      );
    }

    lawyer.isApproved = true;

    lawyer.verificationStatus =
      "approved";

    await saveLawyer(lawyer);

    return lawyer;
  };

export const rejectLawyerService =
  async (lawyerId) => {

    const lawyer =
      await findLawyerById(
        lawyerId
      );

    if (!lawyer) {
      throw new AppError(
        "Lawyer not found",
        404
      );
    }

    lawyer.isApproved = false;

    lawyer.verificationStatus =
      "rejected";

    await saveLawyer(lawyer);

    return lawyer;
  };