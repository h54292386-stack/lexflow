import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true
    },

    lawyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lawyer"
    },

    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case"
    },

    paymentType: {
      type: String,
      enum: [
        "admin_fee",
        "professional_fee"
      ],
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    commissionPercent: {
      type: Number,
      default: 10
    },

    commissionAmount: {
      type: Number,
      default: 0
    },

    lawyerAmount: {
      type: Number,
      default: 0
    },

    lawyerPayoutStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "paid"
      ],
      default: "pending"
    },

    lawyerPaidAt: Date,

    currency: {
      type: String,
      default: "INR"
    },

    razorpayOrderId: {
      type: String,
      required: true
    },

    razorpayPaymentId: String,

    razorpaySignature: String,

    transactionType: {
      type: String,
      enum: [
        "income",
        "refund",
        "payout"
      ],
      default: "income"
    },

    notes: String,

    status: {
      type: String,
      enum: [
        "created",
        "paid",
        "failed",
        "refunded"
      ],
      default: "created"
    },
    receipt: {
      receiptNumber: {
        type: String,
      },

      generatedAt: {
        type: Date,
      },

      downloaded: {
        type: Boolean,
        default: false,
      },

      downloadCount: {
        type: Number,
        default: 0,
      }
    },

  },
  {
    timestamps: true
  });

const Payment = mongoose.model(
  "Payment",
  paymentSchema
);

export default Payment;