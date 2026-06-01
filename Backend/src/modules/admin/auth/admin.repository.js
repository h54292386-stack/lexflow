import Admin from "./admin.model.js";

export const findAdminByEmail = async (
  email
) => {
  return await Admin.findOne({ email });
};

export const createAdmin = async (
  adminData
) => {
  return await Admin.create(adminData);
};