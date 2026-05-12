import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyClientOTP, resendClientOTP } from "../service/AuthService.js";

export default function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputsRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [errorShake, setErrorShake] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error("Email missing. Please register again.");
      navigate("/register");
    }
  }, [email, navigate]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (otp.every((digit) => digit !== "") && !loading) {
      handleVerify();
    }
  }, [otp, loading]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^[0-9]+$/.test(pasted)) return;

    const newOtp = pasted.split("");
    setOtp(newOtp.concat(new Array(6 - newOtp.length).fill("")));
  };

  const handleVerify = async () => {
    if (loading) return;

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }
    try {
      setLoading(true);

      const res = await verifyClientOTP({
        email,
        otp: finalOtp,
      });

      toast.success("Verified & Logged in");

      navigate("/home");
    } catch (error) {
      const msg = error.response?.data?.message || "Verification failed";
      toast.error(msg);

      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 400);

      setOtp(new Array(6).fill(""));
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await resendClientOTP({ email });

      toast.success(res.message || "OTP resent");

      setTimer(30);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to resend";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div
        className={`bg-white p-8 rounded-xl shadow-lg w-[380px] text-center ${
          errorShake ? "animate-shake" : ""
        }`}
      >
        <h2 className="text-xl font-bold mb-2">Verify OTP</h2>

        <p className="text-sm text-gray-500 mb-2">
          Enter the 6-digit code sent to
        </p>
        <p className="text-sm font-medium text-black mb-6">{email}</p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-2 mb-6">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={value}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-10 h-12 text-center text-lg border rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* Resend Section */}
        <div className="mt-4 text-sm">
          <button
            onClick={handleResend}
            disabled={timer > 0}
            className={`${
              timer > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-500 hover:underline"
            }`}
          >
            {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
          </button>
        </div>
      </div>

      {/* Shake Animation */}
      <style>
        {`
          .animate-shake {
            animation: shake 0.3s;
          }

          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
    </div>
  );
}
