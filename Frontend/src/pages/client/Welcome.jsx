import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {

  const navigate = useNavigate();

  useEffect(() => {

    const timer = setTimeout(() => {

      navigate("/complete-profile", {
        replace: true,
      });

    }, 2500);

    return () => clearTimeout(timer);

  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">

      {/* Animated Circle */}
      <div className="w-24 h-24 rounded-full border-4 border-white border-t-transparent animate-spin mb-8"></div>

      <h1 className="text-4xl font-bold mb-3">
        Welcome 
      </h1>

      <p className="text-gray-300 text-lg">
        Your account has been created successfully
      </p>

      <p className="text-gray-500 mt-3 text-sm">
        Preparing your profile setup...
      </p>

    </div>
  );
}