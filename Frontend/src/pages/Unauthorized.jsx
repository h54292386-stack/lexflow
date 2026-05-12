import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      
      <h1 className="text-3xl font-bold text-red-500">
        403 - Unauthorized 
      </h1>

      <p className="text-gray-600">
        You don’t have permission to access this page.
      </p>

      <button
        onClick={() => navigate("/login")}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Go to Login
      </button>

    </div>
  );
}

export default Unauthorized;