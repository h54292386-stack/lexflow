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

export const createConversation = async (clientId, lawyerId) => {

  const res = await api.post("/chat/conversation", { clientId, lawyerId, });

  return res.data;
};

export const getMessages = async (conversationId) => {
  const res = await api.get(`/chat/${conversationId}`);

  return res.data;
};

export const getUserConversations = async (userId) => {
  const res = await api.get(`/chat/conversations/${userId}`);

  return res.data;
};

export const getClientProfile = async () => {
  const res = await api.get("/client/details/profile");

  return res.data;
};

export const updateClientProfile = async (data) => {
  const res = await api.put("/client/details/profile", data);

  return res.data;
};

export const changePassword = async (data) => {
  const res = await api.put(
    "/client/details/change-password",
    data
  );

  return res.data;
};

export const uploadProfileImage = async (formData) => {
  const res = await api.put(
    "/client/details/profile/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};




//lawyer


export const registerLawyer = async (data) => {
  const res = await api.post("/lawyer/register", data);
  return res.data;
};

export const loginLawyer = async (data) => {
  const res = await api.post("/lawyer/login", data);
  return res.data;
};

export const verifyLawyerOTP = async (data) => {
  const res = await api.post("/lawyer/verify-otp", data);

  return res.data;
};

export const resendLawyerOTP = async (data) => {
  const res = await api.post("/lawyer/resend-otp", data);

  return res.data;
};

export const googleLoginLawyer = async (token) => {
  const res = await api.post("/lawyer/google", { token });

  return res.data;
};

export const getLawyerProfile = async () => {
  const res = await api.get("/lawyer/details/profile");

  return res.data;
};

export const updateLawyerProfile = async (data) => {
  const res = await api.put(
    "/lawyer/details/profile",
    data
  );

  return res.data;
};

export const changeLawyerPassword = async (data) => {
  const res = await api.put(
    "/lawyer/details/change-password",
    data
  );

  return res.data;
};

export const uploadLawyerProfileImage = async (formData) => {
  const res = await api.put(
    "/lawyer/details/profile/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};





// admin


export const loginAdmin = async (data) => {
  const res = await api.post("/admin/login", data);
  return res.data;
};