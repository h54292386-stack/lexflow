import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function LawyerHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/lawyer/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-100">
      <h1 className="text-2xl font-bold">Welcome {user?.name || "Lawyer"}</h1>

      <div className="bg-white shadow-md rounded-lg p-6 w-80 text-center">
        <p className="text-gray-600 mb-2">Email: {user?.email}</p>

        <p className="text-gray-600">
          Status: {user?.isVerified ? " Verified" : " Pending Verification"}
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => alert("Coming soon")}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          View Cases
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default LawyerHome;
