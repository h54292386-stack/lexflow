import Lawyer from "./lawyer.model.js";

export const createLawyer = async (data) => {
  return await Lawyer.create(data);
};

export const findLawyerByEmail = (email) => {
  return Lawyer.findOne({ email });
};

export const findLawyerForAuth = (email) => {
  return Lawyer.findOne({ email }).select("+password +refreshToken");
};

export const findLawyerById = (id) => {
  return Lawyer.findById(id);
};
