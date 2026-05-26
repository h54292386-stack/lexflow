import toast from "react-hot-toast";

import { createPaymentOrder, verifyPayment } from "../../service/AuthService";

export default function PaymentPage() {
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
            console.log("PAYMENT SUCCESS", response);

            // VERIFY PAYMENT
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,

              razorpay_payment_id: response.razorpay_payment_id,

              razorpay_signature: response.razorpay_signature,
            });

            toast.success("Payment verified successfully");

            // REDIRECT
            navigate("/payment-history");
          } catch (error) {
            console.log(error);

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
          text-center
        "
      >
        <h1
          className="
            text-3xl
            font-bold
            mb-6
          "
        >
          LexFlow Payment
        </h1>

        <p
          className="
            text-gray-600
            mb-6
          "
        >
          Consultation Fee: ₹500
        </p>

        <button
          onClick={handlePayment}
          className="
            bg-[#d8bf4a]
            hover:bg-[#c9af37]
            text-white
            px-8
            py-3
            rounded-xl
            font-semibold
            transition
          "
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
