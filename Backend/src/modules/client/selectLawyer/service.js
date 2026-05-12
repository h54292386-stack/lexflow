import lawyerRepository from "./repository.js";

const getAllLawyers = async () => {
  return await lawyerRepository.findAllVerified();
};

const getLawyerById = async (lawyerId) => {
  const lawyer = await lawyerRepository.findById(lawyerId);

  if (!lawyer) {
    throw new Error("Lawyer not found");
  }

  // only allow approved lawyers
  if (!lawyer.isApproved || !lawyer.isActive) {
    throw new Error("Lawyer not available");
  }

  return lawyer;
};

export default {
  getAllLawyers, getLawyerById
};