import { useEffect, useState } from "react";

import { getPaymentHistory } from "../../service/AuthService.js";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export default function PaymentHistoryPage() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const data = await getPaymentHistory();

      console.log("PAYMENT HISTORY API:", data);

      setPayments(data.data || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load payments");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const groupedPayments = payments.reduce((groups, payment) => {
    const monthYear = new Date(payment.createdAt).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });

    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }

    groups[monthYear].push(payment);

    return groups;
  }, {});

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
    <div className="min-h-screen bg-gray-100 p-6 ">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8">Payment History</h1>

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
            {Object.entries(groupedPayments).map(([month, monthPayments]) => (
              <div key={month} className="mb-8">
                {/* MONTH HEADER */}

                <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">
                  {month}
                </h2>

                <div className="space-y-3">
                  {monthPayments.map((payment) => (
                    <div
                      key={payment._id}
                        onClick={() => navigate(`/payments/${payment._id}`)}
                      className="
    bg-white
    border
    rounded-xl
    p-4
    flex
    justify-between
    items-start
    hover:shadow-md
    transition
  "
                    >
                      {/* LEFT */}
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            payment.lawyer?.profileImage ||
                            "https://ui-avatars.com/api/?name=Lawyer"
                          }
                          alt=""
                          className=" w-12 h-12 rounded-full object-cover"
                        />

                        <div>
                          <h3 className="font-semibold">
                            {payment.lawyer?.name || "Lawyer"}
                          </h3>

                          <p className="text-xs text-gray-400">
                            {new Date(payment.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-lg">₹{payment.amount}</p>

                        <span
                          className={`text-xs px-2 py-1 rounded-full
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
