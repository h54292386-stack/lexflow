import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    lawyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lawyer",
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    razorpayOrderId: {
      type: String,
      required: true,
    },

    razorpayPaymentId: {
      type: String,
    },

    razorpaySignature: {
      type: String,
    },

    status: {
      type: String,
      enum: [
        "created",
        "paid",
        "failed",
        "refunded",
      ],
      default: "created",
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model(
  "Payment",
  paymentSchema
);

export default Payment;