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
      .populate("lawyer", "name profileImage")
      .sort({ createdAt: -1 });
  };

export const getPaymentByIdRepository =
  async (paymentId) => {

    return await Payment.findById(paymentId)
      .populate("lawyer", "name profileImage")
      .populate("client", "name email")
      .populate("case");
  };


export const incrementReceiptDownloadRepository =
  async (paymentId) => {

    return await Payment.findByIdAndUpdate(
      paymentId,
      {
        $set: {
          "receipt.downloaded": true,
        },

        $inc: {
          "receipt.downloadCount": 1,
        },
      },
      {
        new: true,
      }
    );
  };

export const generateReceiptRepository =
  async (paymentId, receiptData) => {

    return await Payment.findByIdAndUpdate(
      paymentId,
      {
        receipt: receiptData,
      },
      {
        new: true,
      }
    );
  };

export const getPaymentsByCaseRepository =
  async (caseId) => {

    return await Payment.findOne({
      case: caseId,
      paymentType: "professional_fee",
      status: "paid",
    })
      .populate(
        "lawyer",
        "name profileImage"
      )
  .sort({
    createdAt: -1,
  });
  };