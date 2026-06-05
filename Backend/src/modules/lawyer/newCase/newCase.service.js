import Case from "../../client/caseRegisterForm/case.model.js";
import { findRequestedCasesForLawyer } from "./newCase.repository.js";

export const getRequestedCasesService = async (
  lawyerId
) => {
  return await findRequestedCasesForLawyer(
    lawyerId
  );
};

export const acceptCaseRequestService = async (
  caseId,
  lawyerId
) => {
  const caseData =
    await Case.findById(caseId);

  if (!caseData) {
    throw new Error("Case not found");
  }

  const request =
    caseData.requestedLawyers.find(
      (r) =>
        r.lawyerId.toString() ===
        lawyerId.toString()
    );

  if (!request) {
    throw new Error(
      "Request not found"
    );
  }

if (
  request.status !== "interested"
) {
  throw new Error(
    "Show interest before accepting"
  );
}

request.status = "accepted";

  caseData.requestedLawyers.forEach(
  (r) => {
    if (
      r.lawyerId.toString() !==
      lawyerId.toString()
    ) {
      r.status = "declined";
    }
  }
);

  caseData.assignedLawyer = lawyerId;

  caseData.status = "assigned";

  caseData.timeline.push({
    action: "accepted",
  });

  await caseData.save();

  return caseData;
};

export const showInterestService = async (
  caseId,
  lawyerId
) => {
  const caseData =
    await Case.findById(caseId);

  if (!caseData) {
    throw new Error("Case not found");
  }

  const request =
    caseData.requestedLawyers.find(
      (r) =>
        r.lawyerId.toString() ===
        lawyerId.toString()
    );

  if (!request) {
    throw new Error(
      "Request not found"
    );
  }

  if (request.status === "accepted") {
  throw new Error(
    "Case already accepted"
  );
}

if (request.status === "declined") {
  throw new Error(
    "Case already declined"
  );
}

  request.status = "interested";

  await caseData.save();

  return caseData;
};

export const declineCaseService = async (
  caseId,
  lawyerId
) => {
  const caseData =
    await Case.findById(caseId);

  if (!caseData) {
    throw new Error("Case not found");
  }

  const request =
    caseData.requestedLawyers.find(
      (r) =>
        r.lawyerId.toString() ===
        lawyerId.toString()
    );

  if (!request) {
    throw new Error(
      "Request not found"
    );
  }

  request.status = "declined";

  caseData.timeline.push({
    action: "rejected",
  });

  await caseData.save();

  return caseData;
};