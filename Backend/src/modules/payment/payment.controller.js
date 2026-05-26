import { createOrderService,   verifyPaymentService,
 } from "./payment.service.js";

 import {
  getClientPaymentsRepository,
} from "./payment.repository.js";

import { asyncHandler } from "../../shared/middleware/asyncHandler.js";

import AppError from "../../shared/utils/AppError.js";

import { sendResponse } from "../../shared/utils/response.js";


// CREATE ORDER
export const createOrderController = asyncHandler(
  async (req, res) => {

    const { amount } = req.body;

    if (!amount) {
      throw new AppError(
        "Amount is required",
        400
      );
    }

    const order = await createOrderService(
      req.user.id,
      amount
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

      sendResponse(
        res,
        200,
        true,
        "Payments fetched successfully",
        payments
      );
    }
  );