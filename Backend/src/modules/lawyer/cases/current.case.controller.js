import {
  getLawyerCasesService,
  getSingleCaseService
} from "./current.case.service.js";

import { asyncHandler } from "../../../shared/middleware/asyncHandler.js";
import AppError from "../../../shared/utils/AppError.js";
import { sendResponse } from "../../../shared/utils/response.js";


// GET ALL LAWYER CASES
export const getLawyerCasesController =
  asyncHandler(async (req, res) => {

    const lawyerId = req.user.id;

    const cases = await getLawyerCasesService(
      lawyerId
    );

    if (!cases) {
      throw new AppError(
        "Cases not found",
        404
      );
    }

    sendResponse(
      res,
      200,
      true,
      "Cases fetched successfully",
      {
        cases,
      }
    );
  });


// GET SINGLE CASE DETAILS
export const getSingleCaseController =
  asyncHandler(async (req, res) => {

    const lawyerId = req.user.id;

    const { id } = req.params;

    const caseData =
      await getSingleCaseService(
        id,
        lawyerId
      );

    if (!caseData) {
      throw new AppError(
        "Case not found",
        404
      );
    }

    sendResponse(
      res,
      200,
      true,
      "Case fetched successfully",
      {
        case: caseData,
      }
    );
  });