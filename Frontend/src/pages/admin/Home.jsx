import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const AdminHome = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      <div className="w-64 bg-black text-white p-5">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <ul className="space-y-4">
          <li className="hover:text-gray-300 cursor-pointer">
            Dashboard
          </li>
          <li className="hover:text-gray-300 cursor-pointer">
            Clients
          </li>
          <li className="hover:text-gray-300 cursor-pointer">
            Lawyers
          </li>
          <li className="hover:text-gray-300 cursor-pointer">
            Cases
          </li>
        </ul>

        <button
          onClick={handleLogout}
          className="mt-10 w-full bg-red-500 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="flex-1 p-6">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          <div className="text-sm text-gray-600">
            Welcome, <span className="font-semibold">{user?.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-gray-500">Total Clients</h3>
            <p className="text-2xl font-bold mt-2">120</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-gray-500">Total Lawyers</h3>
            <p className="text-2xl font-bold mt-2">45</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-gray-500">Active Cases</h3>
            <p className="text-2xl font-bold mt-2">32</p>
          </div>

        </div>

        <div className="mt-8 bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">
            Recent Activity
          </h2>
          <p className="text-gray-500">
            (Later you can show latest users, cases, approvals, etc.)
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdminHome;