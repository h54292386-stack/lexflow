import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LawyerWelcome() {

  const navigate = useNavigate();

  useEffect(() => {

    const timer = setTimeout(() => {

      navigate("/lawyer/complete-profile", {
        replace: true,
      });

    }, 2500);

    return () => clearTimeout(timer);

  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">

      <div className="w-24 h-24 rounded-full border-4 border-white border-t-transparent animate-spin mb-8"></div>

      <h1 className="text-4xl font-bold mb-3">
        Welcome Advocate 
      </h1>

      <p className="text-gray-300 text-lg">
        Your lawyer account has been created successfully
      </p>

      <p className="text-gray-500 mt-3 text-sm">
        Preparing your professional profile...
      </p>

    </div>
  );
}