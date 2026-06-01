import Lawyer from "../auth/lawyer.model.js";

import AppError from "../../../shared/utils/AppError.js";

export const submitVerificationService =
  async (
    lawyerId,
    data,
    files
  ) => {

    const lawyer =
      await Lawyer.findById(lawyerId);

    if (!lawyer) {
      throw new AppError(
        "Lawyer not found",
        404
      );
    }

   

    lawyer.experience =
      data.experience;

    lawyer.specialization =
      JSON.parse(data.specialization);

    lawyer.education =
      JSON.parse(data.education);

    lawyer.documents = {
      barCertificate:
        files.barCertificate?.[0]?.path,

      enrollmentCertificate:
        files.enrollmentCertificate?.[0]?.path,

      idProof:
        files.idProof?.[0]?.path,

      additionalDocuments:
        files.additionalDocuments?.map(
          (file) => file.path
        ) || [],
    };

    lawyer.verificationStatus =
      "pending";

    await lawyer.save();

    return {
      user: lawyer,
    };
  };