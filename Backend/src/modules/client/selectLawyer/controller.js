import lawyerService from "./service.js";
import { sendResponse } from "../../../shared/utils/response.js";

export const getAllLawyers = async (req, res) => {
  try {
    const lawyers = await lawyerService.getAllLawyers();

    return sendResponse(
      res,
      200,
      true,
      "Lawyers fetched successfully",
      { data: lawyers }
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      false,
      error.message
    );
  }
};

export const getLawyerById = async (req, res) => {
  try {
    const { lawyerId } = req.params;

    const lawyer = await lawyerService.getLawyerById(lawyerId);

    return sendResponse(
      res,
      200,
      true,
      "Lawyer details fetched successfully",
      { data: lawyer }
    );
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};