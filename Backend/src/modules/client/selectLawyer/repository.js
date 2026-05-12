import Lawyer from "../../lawyer/auth/lawyer.model.js";


const findAllVerified = () => {
  return Lawyer.find({
    isApproved: true,
    isActive: true
  })
    .select("name specialization experience rating profileImage")
    .sort({ createdAt: -1 });
};

const findById = (id) => {
  return Lawyer.findById(id)
    .select("-password -refreshToken -otp -__v");
};

export default {
  findAllVerified, findById
};