import api from "./axios.js";

export const registerClient = async (data) => {
  const res = await api.post("/client/register", data);
  return res.data;
};

export const loginClient = async (data) => {
  const res = await api.post("/client/login", data);
  return res.data; 
};

export const logoutClient = async () => {
  const res = await api.delete("/client/logout");
  return res.data;
};

export const googleLoginClient = async (token) => {
  const res = await api.post("/client/google", { token });
  return res.data; 
};

export const registerLawyer = async (data) => {
  const res = await api.post("/lawyer/register", data);
  return res.data;
};

export const loginLawyer = async (data) => {
  const res = await api.post("/lawyer/login", data);
  return res.data; 
};

export const loginAdmin = async (data) => {
  const res = await api.post("/admin/login", data);
  return res.data;
};

export const verifyClientOTP = async (data) => {
  const res = await api.post("/client/verify-otp", data);
  return res.data;
};

export const resendClientOTP = async (data) => {
  const res = await api.post("/client/resend-otp", data);
  return res.data;
};

export const createCase = async (data) => {
  const res = await api.post("/case/create", data);
  return res.data;
};

export const updateCaseDetails = async (caseId, data) => {
  const res = await api.put(`/case/${caseId}/details`, data);
  return res.data;
};

export const uploadCaseDocuments = async (caseId, formData) => {
  const res = await api.post(
    `/case/${caseId}/documents`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const getAllLawyers = async () => {
  const res = await api.get("/lawyers");
  return res.data;
};

export const getLawyerById = async (lawyerId) => {
  const res = await api.get(`/lawyers/${lawyerId}`);
  return res.data;
};

export const requestLawyer = async (caseId, lawyerId) => {
  const res = await api.post(`/case/request/${caseId}`, {
    lawyerId,
  });
  return res.data;
};

export const getClientProfile = async () => {
  const res = await api.get("/client/profile");
  return res.data;
};

export const getDraftCase = async () => {
  const res = await api.get("/case/draft");
  return res.data;
};

export const getClientCases = async () => {
  const res = await api.get("/case/cases");

  return res.data;
};

export const getCaseById = async (caseId) => {
  const res = await api.get(`/case/${caseId}`);

  return res.data;
};

export const deleteCaseDoc = async (caseId, docId) => {
  const res = await api.delete(`/case/${caseId}/document/${docId}`);

  return res.data;
};