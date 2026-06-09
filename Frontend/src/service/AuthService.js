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

export const getCaseProposals = async (
  caseId
) => {
  const res = await api.get(
    `/case/${caseId}/proposals`
  );

  return res.data;
};

export const selectProposal = async (
  caseId,
  requestId
) => {
  const res = await api.put(
    `/case/${caseId}/proposals/${requestId}/select`
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

export const logoutLawyer = async () => {
  const res = await api.delete("/lawyer/logout");
  return res.data;
};

export const getLawyerProfile = async () => {
  const res = await api.get("/lawyer/details/profile");

  return res.data;
};

export const updateLawyerProfile = async (data) => {
  const res = await api.put("/lawyer/details/profile", data);

  return res.data;
};

export const changeLawyerPassword = async (data) => {
  const res = await api.put("/lawyer/details/change-password", data);

  return res.data;
};

export const uploadLawyerProfileImage = async (formData) => {
  const res = await api.put("/lawyer/details/profile/image", formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const submitLawyerVerification = async (formData) => {

  const res = await api.put("/lawyer/verification/submit", formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );


  return res.data;

};

export const getLawyerCaseRequests = async () => {
  const response = await api.get( "/lawyer/case-requests/requested");

  return response.data;
};

export const acceptCaseRequest = async (caseId) => {
  const response = await api.put( `/lawyer/case-requests/${caseId}/accept`);

  return response.data;
};

export const showInterestInCase = async ( caseId) => {
  const response = await api.put(`/lawyer/case-requests/${caseId}/interest`);

  return response.data;
};

export const declineCaseRequest = async (caseId) => {
  const response = await api.put(`/lawyer/case-requests/${caseId}/decline` );

  return response.data;
};


export const createLawyerConversation = async (clientId, lawyerId) => {

  const res = await api.post("/lawyer/chat/conversation", { clientId, lawyerId, });

  return res.data;
};

export const getLawyerMessages = async (conversationId) => {
  const res = await api.get(`/lawyer/chat/${conversationId}`);

  return res.data;
};

export const getLawyerConversations = async (userId) => {
  const res = await api.get(`/lawyer/chat/conversations/${userId}`);

  return res.data;
};

export const submitProposal = async (
  caseId,
  proposalData
) => {
  const res = await api.post(
    `/lawyer/case-requests/${caseId}/proposal`,
    proposalData
  );

  return res.data;
};


// admin


export const loginAdmin = async (data) => {
  const res = await api.post("/admin/login", data);
  return res.data;
};

export const getPendingLawyers =
  async () => {
    const res = await api.get(
      "/admin/lawyers/pending"
    );

    return res.data;
  };

export const approveLawyer =
  async (lawyerId) => {
    const res = await api.put(
      `/admin/lawyers/${lawyerId}/approve`
    );

    return res.data;
  };

export const rejectLawyer =
  async (lawyerId) => {
    const res = await api.put(
      `/admin/lawyers/${lawyerId}/reject`
    );

    return res.data;
  };


//payment

export const createPaymentOrder =
  async (paymentData) => {

    const res = await api.post(
      "/payment/create-order",
        paymentData,
      
    );

    return res.data;
  };

export const verifyPayment = async (paymentData) => {

    const res = await api.post(
      "/payment/verify-payment",
      paymentData
    );

    return res.data;
  };

export const getPaymentHistory = async () => {
  const { data } = await api.get("/payment/history");
  return data;
};

export const getPaymentById = async (paymentId) => {
  const response = await api.get(
    `/payment/${paymentId}`
  );

  return response.data;
};

    export const downloadReceipt =
  async (paymentId) => {

    const res = await api.patch(
      `/payment/${paymentId}/download-receipt`
    );

    return res.data;
  };

  export const getCasePayments = async (caseId) => {
  const res = await api.get(
    `/payment/case/${caseId}`
  );

  return res.data;
};

export const getNotifications = () => api.get("/notifications");


export const markNotificationRead = (id) =>  api.patch(`/notifications/${id}/read`);

export const markAllNotificationsRead = async () => {
  const res = await api.patch("/notifications/mark-all-read");
  return res.data;
};


