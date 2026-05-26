import { useEffect, useState } from "react";

import { getPaymentHistory } from "../../service/AuthService.js";

import toast from "react-hot-toast";

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const data = await getPaymentHistory();

      setPayments(data || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load payments");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
        "
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-gray-100
        p-6
      "
    >
      <div
        className="
          max-w-5xl
          mx-auto
          bg-white
          rounded-2xl
          shadow-lg
          p-8
        "
      >
        <h1
          className="
            text-3xl
            font-bold
            mb-8
          "
        >
          Payment History
        </h1>

        {payments.length === 0 ? (
          <div
            className="
              text-center
              text-gray-500
              py-10
            "
          >
            No payments found
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment._id}
                className="
                  border
                  rounded-xl
                  p-5
                  flex
                  items-center
                  justify-between
                "
              >
                {/* LEFT */}
                <div className="space-y-1">
                  <p
                    className="
                      font-semibold
                      text-lg
                    "
                  >
                    ₹{payment.amount}
                  </p>

                  <p
                    className="
                      text-sm
                      text-gray-500
                    "
                  >
                    Order ID: {payment.razorpayOrderId}
                  </p>

                  <p
                    className="
                      text-sm
                      text-gray-500
                    "
                  >
                    Payment ID: {payment.razorpayPaymentId || "Pending"}
                  </p>

                  <p
                    className="
                      text-sm
                      text-gray-500
                    "
                  >
                    {new Date(payment.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* RIGHT */}
                <div>
                  <span
                    className={`
                      px-4
                      py-2
                      rounded-full
                      text-sm
                      font-medium

                      ${
                        payment.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : payment.status === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }
                    `}
                  >
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
