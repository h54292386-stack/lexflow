import crypto from "crypto";
import { razorpayInstance } from "../../config/razorpay.js";
import Payment from "./payment.model.js";
import Case from "../client/caseRegisterForm/case.model.js";
import {
    createPaymentRepository, updatePaymentRepository,generateReceiptRepository

} from "./payment.repository.js";


export const createOrderService =
    async (
        clientId,
        paymentData
    ) => {

        const {
            lawyerFee,
            adminFee,
            totalAmount,
            lawyerId,
            caseId,
        } = paymentData;


        const options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order =
            await razorpayInstance.orders.create(
                options
            );

        await createPaymentRepository({
            client: clientId,

            lawyer: lawyerId,

            case: caseId,

            paymentType: "professional_fee",

            amount: totalAmount,

            commissionAmount: adminFee,

            lawyerAmount: lawyerFee,

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
          const receiptNumber =
            `LF-${Date.now()}`;

        const payment =
            await updatePaymentRepository(
                razorpay_order_id,
                {
                    razorpayPaymentId:
                        razorpay_payment_id,

                    razorpaySignature:
                        razorpay_signature,

                    status: "paid",

                    lawyerPayoutStatus:
                        "pending",

                    receipt: {
                        receiptNumber,

                        generatedAt:
                            new Date()
                    }
                }
            );
            await Case.findByIdAndUpdate(
  payment.case,
  {
    "professionalPayment.status":
      "success",

    "professionalPayment.paid":
      true,

    "professionalPayment.paidAt":
      new Date(),

    status: "assigned",

    $push: {
      timeline: {
        action:
          "professional_fee_paid",
      },
    },
  }
);

        return payment;
    };

 