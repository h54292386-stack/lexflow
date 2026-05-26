import express from "express";

import {
  createOrderController,  verifyPaymentController,  getClientPaymentsController,} from "./payment.controller.js";

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
export default router;