import Payment from "./payment.model.js";


export const createPaymentRepository =
  async (paymentData) => {

    return await Payment.create(
      paymentData
    );
  };


export const updatePaymentRepository =
  async (
    razorpayOrderId,
    updateData
  ) => {

    return await Payment.findOneAndUpdate(
      { razorpayOrderId },
      updateData,
      { new: true }
    );
  };


export const getClientPaymentsRepository =
  async (clientId) => {

    return await Payment.find({
      client: clientId,
    })
      .sort({ createdAt: -1 });
  };