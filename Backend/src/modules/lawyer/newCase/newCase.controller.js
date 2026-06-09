import { getRequestedCasesService  , showInterestService, declineCaseService,  submitProposalService} from "./newCase.service.js";
import { sendResponse } from "../../../shared/utils/response.js";
import { asyncHandler } from "../../../shared/middleware/asyncHandler.js";

export const getRequestedCases = asyncHandler(
  async (req, res) => {
    console.log("REQ USER:", req.user);

    const cases =
      await getRequestedCasesService(
        req.user.id
      );

    console.log("CASES COUNT:", cases.length);

    return sendResponse(
      res,
      200,
      true,
      "Requested cases fetched",
      { cases }
    );
  }
);

export const submitProposal =
  asyncHandler(async (req, res) => {
    const {
      professionalFee,
      estimatedDuration,
      notes,
    } = req.body;

    const data =
      await submitProposalService(
        req.params.caseId,
        req.user.id,
        {
          professionalFee,
          estimatedDuration,
          notes,
        }
      );

    return sendResponse(
      res,
      200,
      true,
      "Proposal submitted successfully",
      data
    );
  });

export const acceptCaseRequest = asyncHandler(
  async (req, res) => {
    const data =
      await acceptCaseRequestService(
        req.params.caseId,
        req.user.id
      );

    return sendResponse(
      res,
      200,
      true,
      "Case accepted successfully",
      data
    );
  }
);

export const showInterest =
  asyncHandler(async (req, res) => {
    const data =
      await showInterestService(
        req.params.caseId,
        req.user.id
      );

    return sendResponse(
      res,
      200,
      true,
      "Interest sent successfully",
      data
    );
  });

  export const declineCase =
  asyncHandler(async (req, res) => {
    const data =
      await declineCaseService(
        req.params.caseId,
        req.user.id
      );

    return sendResponse(
      res,
      200,
      true,
      "Case declined successfully",
      data
    );
  });