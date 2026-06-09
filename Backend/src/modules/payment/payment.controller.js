import {
  createOrderService, verifyPaymentService
} from "./payment.service.js";

import {
  getClientPaymentsRepository, getPaymentByIdRepository, incrementReceiptDownloadRepository, getPaymentsByCaseRepository
} from "./payment.repository.js";

import { asyncHandler } from "../../shared/middleware/asyncHandler.js";

import AppError from "../../shared/utils/AppError.js";

import { sendResponse, sendResponses } from "../../shared/utils/response.js";


// CREATE ORDER
export const createOrderController = asyncHandler(
  async (req, res) => {

    const {
      lawyerFee,
      adminFee,
      totalAmount,
      lawyerId,
      caseId,
    } = req.body;


    if (!lawyerFee || !adminFee || !totalAmount) {
      throw new AppError(
        "Amount is required",
        400
      );
    }

    const order = await createOrderService(
      req.user.id,
      {
        lawyerFee,
        adminFee,
        totalAmount,
        lawyerId,
        caseId,
      }
    );

    sendResponse(
      res,
      200,
      true,
      "Order created successfully",
      {
        order,
      }
    );
  }
);

export const verifyPaymentController =
  asyncHandler(
    async (req, res) => {

      const payment =
        await verifyPaymentService(
          req.body
        );

      sendResponse(
        res,
        200,
        true,
        "Payment verified successfully",
        payment
      );
    }
  );



export const getClientPaymentsController =
  asyncHandler(
    async (req, res) => {

      const payments =
        await getClientPaymentsRepository(
          req.user.id
        );

      sendResponses(
        res,
        200,
        true,
        "Payments fetched successfully",
        payments
      );
    }
  );

export const getPaymentByIdController =
  asyncHandler(async (req, res) => {

    const payment =
      await getPaymentByIdRepository(
        req.params.paymentId
      );

    if (!payment) {
      throw new AppError(
        "Payment not found",
        404
      );
    }

    const paymentClientId =
      payment.client._id.toString();

    const loggedInUserId =
      req.user.id.toString();

    console.log(
      "Payment Client ID:",
      paymentClientId
    );

    console.log(
      "Logged User ID:",
      loggedInUserId
    );

    console.log(
      "Match:",
      paymentClientId === loggedInUserId
    );

    if (paymentClientId !== loggedInUserId) {
      throw new AppError(
        "Unauthorized",
        403
      );
    }

    console.log(
      "PASSED AUTHORIZATION CHECK"
    );

    sendResponses(
      res,
      200,
      true,
      "Payment fetched successfully",
      payment
    );
  });

export const downloadReceiptController =
  asyncHandler(async (req, res) => {

    const payment =
      await getPaymentByIdRepository(
        req.params.paymentId
      );

    if (!payment) {
      throw new AppError(
        "Payment not found",
        404
      );
    }

    if (
      payment.client._id.toString() !==
      req.user.id.toString()
    ) {
      throw new AppError(
        "Unauthorized",
        403
      );
    }

    const updatedPayment =
      await incrementReceiptDownloadRepository(
        req.params.paymentId
      );

    sendResponses(
      res,
      200,
      true,
      "Receipt downloaded",
      updatedPayment
    );
});


export const getCasePaymentsController =
  asyncHandler(async (req, res) => {

    const payments =
      await getPaymentsByCaseRepository(
        req.params.caseId
      );

    sendResponses(
      res,
      200,
      true,
      "Case payments fetched",
      payments
    );

  });