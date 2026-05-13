import Case from "./case.model.js";

export const createCaseRepo = (data) => {
  return Case.create(data);
};

export const findCaseByIdAndClient = (caseId, clientId) => {
  return Case.findOne({ _id: caseId, clientId });
};

export const saveCase = (caseDoc) => {
  return caseDoc.save();
};

export const update = (id, data) => {
  return Case.findByIdAndUpdate(id, data, { new: true });
};

export const findCasesByClientId = async (clientId) => {
  return await Case.find({ clientId })
    .populate("requestedLawyers.lawyerId", "name email")
    .sort({ createdAt: -1 });
};

export const findCaseById = async (caseId) => {
  return await Case.findById(caseId);
};

export const deleteCaseDocumentRepo = async (caseId, docId) => {
  return await Case.findByIdAndUpdate(
    caseId,
    {
      $pull: {
        documents: {
          _id: docId,
        },
      },
    },
    { new: true }
  );
};