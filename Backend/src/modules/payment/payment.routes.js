import express from "express";

import {
  createOrderController,  verifyPaymentController,  getClientPaymentsController,getPaymentByIdController, downloadReceiptController, getCasePaymentsController} from "./payment.controller.js";

import {authenticateUser,} from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/create-order",
  authenticateUser,
  createOrderController
);

router.post(
  "/verify-payment",
  authenticateUser,
  verifyPaymentController
);

router.get(
  "/history",
  authenticateUser,
  getClientPaymentsController
);

router.get(
  "/:paymentId",
  authenticateUser,
  getPaymentByIdController
);

router.patch(
  "/:paymentId/download-receipt",
  authenticateUser,
  downloadReceiptController
);

router.get(
  "/case/:caseId",
  authenticateUser,
  getCasePaymentsController
);
export default router;