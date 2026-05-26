import crypto from "crypto";
import { razorpayInstance } from "../../config/razorpay.js";

import {
  createPaymentRepository,  updatePaymentRepository,

} from "./payment.repository.js";


export const createOrderService =
  async (
    clientId,
    amount
  ) => {

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order =
      await razorpayInstance.orders.create(
        options
      );

    await createPaymentRepository({
      client: clientId,
      amount,
      razorpayOrderId: order.id,
      status: "created",
    });

    return order;
  };

  export const verifyPaymentService =
    async ({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    }) => {

        // CREATE SIGNATURE
        const body =
            razorpay_order_id +
            "|" +
            razorpay_payment_id;

        const expectedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(body.toString())
                .digest("hex");

        // VERIFY
        const isAuthentic =
            expectedSignature ===
            razorpay_signature;

        if (!isAuthentic) {

            await updatePaymentRepository(
                razorpay_order_id,
                {
                    status: "failed",
                }
            );

            throw new Error(
                "Payment verification failed"
            );
        }

        // UPDATE PAYMENT
        const payment =
            await updatePaymentRepository(
                razorpay_order_id,
                {
                    razorpayPaymentId:
                        razorpay_payment_id,

                    razorpaySignature:
                        razorpay_signature,

                    status: "paid",
                }
            );

        return payment;
    };