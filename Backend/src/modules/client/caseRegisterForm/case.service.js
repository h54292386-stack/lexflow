import mongoose from "mongoose";
import { createCaseRepo, findCaseByIdAndClient, saveCase, update, findCasesByClientId, findCaseById, deleteCaseDocumentRepo } from "./case.repository.js";
import Case from "./case.model.js";
import AppError from "../../../shared/utils/AppError.js";


export const createCaseService = async (clientId, body) => {

  // CHECK EXISTING DRAFT
  const existingDraft = await Case.findOne({
    clientId,
    status: "draft"
  });

  // RETURN EXISTING DRAFT
  if (existingDraft) {
    return existingDraft;
  }

  // CREATE NEW DRAFT
  return createCaseRepo({
    clientId,
    personalData: body.personalData,
    stepCompleted: 1,
    isDraft: true,
    status: "draft",
    timeline: [{ action: "created" }]
  });
};

export const updateCaseDetailsService = async (caseId, clientId, data) => {
  if (!caseId || !mongoose.Types.ObjectId.isValid(caseId)) {
    throw new Error("Invalid case ID");
  }

  const caseDoc = await findCaseByIdAndClient(caseId, clientId);
  if (!caseDoc) throw new Error("Case not found");

  if (caseDoc.stepCompleted < 1) {
    throw new Error("Complete previous step first");
  }

  if (!data || typeof data !== "object") {
    throw new Error("Invalid case details payload");
  }

  if (data.personalData) {
    caseDoc.personalData = {
      ...(caseDoc.personalData?.toObject?.() || {}),
      ...data.personalData,

      idProof: {
        ...(caseDoc.personalData?.idProof || {}),
        ...(data.personalData?.idProof || {}),
      },
    };
  }

  if (data.caseDetails) {
    caseDoc.caseDetails = {
      ...(caseDoc.caseDetails?.toObject?.() || {}),
      ...data.caseDetails,

      opponent: {
        ...(caseDoc.caseDetails?.opponent || {}),
        ...(data.caseDetails?.opponent || {}),
      },

      incidentLocation: {
        ...(caseDoc.caseDetails?.incidentLocation || {}),
        ...(data.caseDetails?.incidentLocation || {}),
      },
    };
  }

  if (data.shareWithLawyer !== undefined) {
    caseDoc.shareWithLawyer = data.shareWithLawyer;
  }


  caseDoc.stepCompleted = Math.max(caseDoc.stepCompleted, 2);

  caseDoc.timeline = caseDoc.timeline || [];

  caseDoc.timeline.push({
    action: "case_updated",
    date: new Date(),
  });

  return saveCase(caseDoc);
};

export const uploadDocumentsService = async (
  caseId,
  clientId,
  files,
  body
) => {
  if (!caseId || !mongoose.Types.ObjectId.isValid(caseId)) {
    throw new Error("Invalid case ID");
  }

  const caseDoc = await findCaseByIdAndClient(caseId, clientId);

  if (!caseDoc) throw new Error("Case not found");

  if (caseDoc.stepCompleted < 2) {
    throw new Error("Complete previous steps first");
  }

  if (!files || files.length === 0) {
    throw new Error("No files uploaded");
  }

  const docs = files.map(file => ({
    documentName: body.documentName,
    documentType: body.documentType,
    fileUrl: file.secure_url || file.path,
    publicId: file.public_id || file.filename
  }));

  caseDoc.documents.push(...docs);
  caseDoc.stepCompleted = 3;
  caseDoc.status = "submitted";
  caseDoc.isDraft = false;

  caseDoc.timeline.push({ action: "submitted" });

  return saveCase(caseDoc);
};

export const getDraftCaseService = async (clientId) => {
  return await Case.findOne({
    clientId,
    isDraft: true,
    status: "draft",
  }).sort({ updatedAt: -1 });
};

export const requestLawyerService = async (
  caseId,
  lawyerId,
  clientId
) => {
  if (!caseId || !mongoose.Types.ObjectId.isValid(caseId)) {
    throw new Error("Invalid case ID");
  }

  const caseData = await findCaseByIdAndClient(caseId, clientId);

  if (!caseData) {
    throw new Error("Case not found or unauthorized");
  }

  if (caseData.assignedLawyer) {
    throw new Error("Case already assigned");
  }

  const alreadyRequested = (caseData.requestedLawyers || []).some(
    (l) => l.lawyerId?.toString() === lawyerId?.toString()
  );

  if (alreadyRequested) {
    throw new Error("Already requested this lawyer");
  }

  const updated = await Case.findByIdAndUpdate(
    caseId,
    {
      $push: {
        requestedLawyers: {
          lawyerId,
          status: "new",
        },
        timeline: { action: "requested" },
      },
      $set: {
        status: "requested",
      },
    },
    { new: true }
  );

  return updated;
};

export const getClientCasesService = async (clientId) => {
  const cases = await findCasesByClientId(clientId);

  if (!cases) {
    throw new AppError("No cases found", 404);
  }

  return cases;
};

export const getCaseByIdService = async (
  caseId,
  clientId
) => {
  if (!mongoose.Types.ObjectId.isValid(caseId)) {
    throw new Error("Invalid case ID");
  }

  const caseData = await findCaseById(caseId);

  if (!caseData) {
    throw new Error("Case not found");
  }

  // security check
  if (caseData.clientId.toString() !== clientId.toString()) {
    throw new Error("Unauthorized");
  }

  return caseData;
};


export const deleteCaseDocumentService = async (
  caseId,
  docId
) => {
  const updatedCase = await deleteCaseDocumentRepo(
    caseId,
    docId
  );

  if (!updatedCase) {
    throw new Error("Case not found");
  }

  return updatedCase;
};


export const getCaseProposalsService = async (
  caseId,
  clientId
) => {
  const caseData =
    await Case.findOne({
      _id: caseId,
      clientId,
    }).populate(
      "requestedLawyers.lawyerId",
      "name profileImage"
    );

  if (!caseData) {
    throw new Error("Case not found");
  }

  if (
  !mongoose.Types.ObjectId.isValid(
    caseId
  )
) {
  throw new Error("Invalid case ID");
}

 return caseData.requestedLawyers
  .filter((r) => r.proposal?.proposedAt)
  .map((r) => ({
    requestId: r._id,
    lawyerId: r.lawyerId,
    professionalFee:
      r.proposal.professionalFee,
    estimatedDuration:
      r.proposal.estimatedDuration,
    notes: r.proposal.notes,
    status: r.proposal.status,
    proposedAt:
      r.proposal.proposedAt,
  }));
};

export const selectProposalService = async (
  caseId,
  requestId,
  clientId
) => {
  const caseData = await Case.findOne({
    _id: caseId,
    clientId,
  });

  if (!caseData) {
    throw new Error("Case not found");
  }

  const selectedRequest =
    caseData.requestedLawyers.id(requestId);

  if (!selectedRequest) {
    throw new Error("Proposal not found");
  }

  if (!selectedRequest.proposal) {
    throw new Error("Proposal not submitted");
  }

  // save selected proposal
  caseData.selectedProposal = {
    requestId: selectedRequest._id,
    lawyerId: selectedRequest.lawyerId,
    professionalFee:
      selectedRequest.proposal.professionalFee,
    estimatedDuration:
      selectedRequest.proposal.estimatedDuration,
    notes: selectedRequest.proposal.notes,
    selectedAt: new Date(),
  };

  // update proposal statuses
  caseData.requestedLawyers.forEach((r) => {
    if (
      r._id.toString() === requestId
    ) {
      r.proposal.status = "selected";
      r.status = "selected";
    } else if (r.proposal) {
      r.proposal.status = "rejected";
    }
  });

  caseData.status =
    "proposal_selected";

  caseData.timeline.push({
    action: "proposal_selected",
  });

  await caseData.save();

  return caseData;
};