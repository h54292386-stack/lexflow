import Lawyer from "../auth/lawyer.model.js";

export const getLawyerProfileRepo = async (lawyerId) => {
  return await Lawyer.findById(lawyerId);
};

export const updateLawyerProfileRepo = async (
  lawyerId,
  updateData
) => {
  return await Lawyer.findByIdAndUpdate(
    lawyerId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const getLawyerWithPasswordRepo = async (lawyerId) => {
  return await Lawyer.findById(lawyerId).select("+password");
};