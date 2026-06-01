import Lawyer from "../../lawyer/auth/lawyer.model.js";

export const findPendingLawyers =
  async () => {
    return await Lawyer.find({
      verificationStatus: "pending",
      documents: { $exists: true },
    }).sort({ createdAt: -1 });
};


export const findLawyerById = async (lawyerId) => {
    return await Lawyer.findById(lawyerId).select("+password");
};


export const saveLawyer = async (lawyer) => {
    return await lawyer.save({ validateModifiedOnly: true });
};
