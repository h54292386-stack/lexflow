import toast from "react-hot-toast";

import { useParams, useLocation,useNavigate } from "react-router-dom";

import { createPaymentOrder, verifyPayment } from "../../service/AuthService";

export default function ConsultationPaymentPage() {
  const navigate = useNavigate();
  const { caseId, lawyerId } = useParams();

  const location = useLocation();

  const { lawyerName, caseName } = location.state || {};

  const handlePayment = async () => {
    try {
      // CREATE ORDER
      const data = await createPaymentOrder(500);

      const order = data.order;

      // RAZORPAY OPTIONS
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: order.amount,

        currency: order.currency,

        name: "LexFlow",

        description: "Lawyer Consultation Payment",

        order_id: order.id,

        handler: async function (response) {
          try {
            // VERIFY PAYMENT
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,

              razorpay_payment_id: response.razorpay_payment_id,

              razorpay_signature: response.razorpay_signature,
            });

            toast.success("Payment successful");

            setTimeout(() => {
              navigate("/payment-history", {
                state: {
                  paymentId: response.razorpay_payment_id,

                  orderId: response.razorpay_order_id,

                  caseName,
                  lawyerName,
                  amount: 500,
                },
              });
            }, 1500);
          } catch (err) {
            console.log(err);

            toast.error("Payment verification failed");
          }
        },

        prefill: {
          name: "Client",
          email: "client@gmail.com",
        },

        theme: {
          color: "#d8bf4a",
        },
      };

      // OPEN RAZORPAY
      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.log(error);

      toast.error("Payment failed");
    }
  };

  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-100
      "
    >
      <div
        className="
          bg-white
          p-10
          rounded-2xl
          shadow-xl
          w-full
          max-w-md
        "
      >
        <h1
          className="
            text-3xl
            font-bold
            mb-6
            text-center
          "
        >
          Consultation Payment
        </h1>

        <div className="space-y-3 mb-6">
          <p>
            <span className="font-semibold">Case:</span> {caseName}
          </p>

          <p>
            <span className="font-semibold">Lawyer:</span> {lawyerName}
          </p>
        </div>

        <div
          className="
            border
            rounded-xl
            p-5
            mb-6
            bg-gray-50
          "
        >
          <p className="font-semibold">Consultation Fee</p>

          <p
            className="
              text-4xl
              font-bold
              mt-2
            "
          >
            ₹500
          </p>
        </div>

        <button
          onClick={handlePayment}
          className="
            w-full
            bg-black
            text-white
            py-3
            rounded-xl
            font-semibold
            hover:opacity-90
            transition
          "
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
