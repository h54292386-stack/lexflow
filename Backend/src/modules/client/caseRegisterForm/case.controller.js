import { createCaseService, updateCaseDetailsService, uploadDocumentsService, requestLawyerService, getDraftCaseService,getClientCasesService ,getCaseByIdService, deleteCaseDocumentService, getCaseProposalsService, selectProposalService } from "./case.service.js";
import { asyncHandler } from "../../../shared/middleware/asyncHandler.js";
import { sendResponse } from "../../../shared/utils/response.js";


export const createCase = asyncHandler(async (req, res) => {

  const data = await createCaseService(req.user.id, req.body);

  res.status(201).json({
    success: true,
    data
  });
});

export const updateCaseDetails = asyncHandler(async (req, res) => {
  if (!req.params.caseId || req.params.caseId === "null") {
    return res.status(400).json({
      success: false,
      message: "Case ID is required"
    });
  }

  const data = await updateCaseDetailsService(
    req.params.caseId,
    req.user.id,
    req.body
  );

  res.json({ success: true, data });
});

export const uploadDocuments = asyncHandler(async (req, res) => {
  if (!req.params.caseId || req.params.caseId === "null") {
    return res.status(400).json({
      success: false,
      message: "Case ID is required"
    });
  }

  const data = await uploadDocumentsService(
    req.params.caseId,
    req.user.id,
    req.files,
    req.body
  );

  res.json({ success: true, data });
});

export const getDraftCase = asyncHandler(async (req, res) => {
  const data = await getDraftCaseService(req.user.id);

  res.json({
    success: true,
    data
  });
});

export const requestLawyer = asyncHandler(async (req, res) => {
  const { caseId } = req.params;
  const { lawyerId } = req.body;

  if (!caseId || caseId === "null") {
    return res.status(400).json({
      success: false,
      message: "Case ID is required",
    });
  }

  if (!lawyerId) {
    return res.status(400).json({
      success: false,
      message: "Lawyer ID is required",
    });
  }

  const result = await requestLawyerService(
    caseId,
    lawyerId,
    req.user.id
  );

  return sendResponse(
    res,
    200,
    true,
    "Request sent successfully",
    result
  );
});

export const getClientCases = asyncHandler(async (req, res) => {

  const clientId = req.user.id;

  const cases = await getClientCasesService(clientId);

  return sendResponse(
    res,
    200,
    true,
    "Cases fetched successfully",
    { cases }
  );
});

export const getCaseById = asyncHandler(async (req, res) => {
  
  const data = await getCaseByIdService(
    req.params.caseId,
    req.user.id
  );

  return sendResponse(
    res,
    200,
    true,
    "Case fetched successfully",
    data
  );
});

export const deleteCaseDoc = asyncHandler(async (req, res) => {
  const { caseId, docId } = req.params;

  const updatedCase = await deleteCaseDocumentService(
    caseId,
    docId
  );

  return sendResponse(
    res,
    200,
    true,
    "Document deleted successfully",
    updatedCase
  );
});

export const getCaseProposals =
  asyncHandler(async (req, res) => {
    const proposals =
      await getCaseProposalsService(
        req.params.caseId,
        req.user.id
      );

    return sendResponse(
      res,
      200,
      true,
      "Proposals fetched",
      { proposals }
    );
  });

  export const selectProposal =
  asyncHandler(async (req, res) => {
    const data =
      await selectProposalService(
        req.params.caseId,
        req.params.requestId,
        req.user.id
      );

    return sendResponse(
      res,
      200,
      true,
      "Proposal selected successfully",
      data
    );
  });