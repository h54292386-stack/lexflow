import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaFileInvoiceDollar,
  FaDownload,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { getPaymentById, downloadReceipt } from "../../service/AuthService";

export default function PaymentDetailsPage() {
  const { paymentId } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayment();
  }, []);

  const loadPayment = async () => {
    try {
      const data = await getPaymentById(paymentId);

      console.log("PAYMENT DETAILS:", data);

      setPayment(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

const handleReceipt = async () => {

  try {

    const res =
      await downloadReceipt(payment._id);

    setPayment(res.data);

    window.print();

    toast.success(
      "Receipt downloaded"
    );

  } catch (error) {

    toast.error(
      "Failed to download receipt"
    );
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Payment not found
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-8 px-4">
      {/* HEADER */}
      <button onClick={() => navigate(-1)} className="text-2xl">
        <FaArrowLeft />
      </button>

      <div className=" max-w-xl mx-auto bg-gradient-to-b from-slate-900 to-slate-800 text-white rounded-3xl pb-20 pt-5 px-5 shadow-xl">
        <div className="p-6 flex flex-col items-center text-center">
          <img
            src={
              payment.lawyer?.profileImage ||
              "https://ui-avatars.com/api/?name=Lawyer"
            }
            alt={payment.lawyer?.name}
            className="  w-20  h-20  rounded-full  object-cover  border-4  border-gray-100  shadow-md  "
          />

          <h3 className="mt-3 font-semibold text-lg">
            To {payment.lawyer?.name}
          </h3>
        </div>

        <div className="text-center mt-8">
          <FaCheckCircle
            className="
              text-green-400
              text-6xl
              mx-auto
            "
          />

          <h1 className="text-4xl font-bold mt-5"> ₹{payment.amount}</h1>

          <p className="text-green-300 text-lg mt-3">Payment Successful</p>

          <p className="text-gray-300 text-sm mt-2">
            {new Date(payment.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* FLOATING CARD */}

      <div
        className="
    -mt-14
    relative
    z-10
    max-w-xl
    mx-auto
    px-3
    pb-10
  "
      >
        <div
          className="
    bg-white
    rounded-3xl
    shadow-2xl
    overflow-hidden
    border
  "
        >
          {/* TRANSACTION DETAILS */}

          <SectionTitle
            icon={<FaFileInvoiceDollar />}
            title="Transaction Details"
          />

          <Detail label="Transaction ID" value={payment.razorpayPaymentId} />
          <Detail
            label="Receipt Number"
            value={payment.receipt?.receiptNumber}
          />
          <Detail
            label="Receipt Generated"
            value={
              payment.receipt?.generatedAt
                ? new Date(payment.receipt.generatedAt).toLocaleString()
                : "-"
            }
          />

          <Detail
            label="Downloads"
            value={payment.receipt?.downloadCount || 0}
          />
          <Detail label="To" value={payment.lawyer?.name} />
          <Detail label="From" value={payment.client?.name} />
          <Detail label="Order ID" value={payment.razorpayOrderId} />

          {/* FEES */}

          <div className="p-3">
            <div className="bg-gray-50 rounded-2xl p-3">
              <div className="flex justify-between mb-3">
                <span>Lawyer Fee</span>

                <span className="font-medium">₹{payment.lawyerAmount}</span>
              </div>

              <div className="flex justify-between mb-3">
                <span>Platform Fee</span>

                <span className="font-medium">₹{payment.commissionAmount}</span>
              </div>

              <hr />

              <div
                className="
                  flex
                  justify-between
                  mt-3
                  font-bold
                  text-lg
                "
              >
                <span>Total Paid</span>

                <span>₹{payment.amount}</span>
              </div>
            </div>
          </div>
          <div className="px-3 pb-4">
            <button
              className="
      w-full
      bg-slate-900
      hover:bg-slate-800
      text-white
      py-3
      rounded-xl
      font-medium
      transition
    "
              onClick={handleReceipt}
            >
              Download Receipt
            </button>
          </div>

          {/* TIMELINE */}

          <SectionTitle icon={<FaCheckCircle />} title="Payment Timeline" />

          <div className="p-4 space-y-6">
            <TimelineItem
              title="Payment Created"
              date={new Date(payment.createdAt).toLocaleString()}
            />

            <TimelineItem
              title="Payment Verified"
              date={new Date(payment.updatedAt).toLocaleString()}
            />

            <TimelineItem
              title="Payment Successful"
              date="Amount credited successfully"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- */

function SectionTitle({ icon, title }) {
  return (
    <div
      className="
        px-5
        py-4
        border-t
        bg-gray-50
        flex
        items-center
        gap-3
      "
    >
      <span className="text-blue-600">{icon}</span>

      <h2 className="font-normal text-sm">{title}</h2>
    </div>
  );
}

/* -------------------------------- */

function Detail({ label, value }) {
  return (
    <div className="px-3 py-2 border-b">
      <p className="text-xs text-gray-500">{label}</p>

      <p
        className="
          font-semibold
          mt-1
          break-all
        "
      >
        {value || "-"}
      </p>
    </div>
  );
}

/* -------------------------------- */

function TimelineItem({ title, date }) {
  return (
    <div className="flex gap-4">
      <div
        className="
          w-4
          h-4
          rounded-full
          bg-green-500
          mt-1
        "
      />

      <div>
        <h4 className="font-semibold">{title}</h4>

        <p className="text-sm text-gray-500">{date}</p>
      </div>
    </div>
  );
}
