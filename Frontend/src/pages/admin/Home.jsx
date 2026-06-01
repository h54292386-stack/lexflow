import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

import AdminSidebar from "./AdminSidebar";

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

      <AdminSidebar
        navigate={navigate}
        handleLogout={handleLogout}
      />

      <div className="flex-1 p-6">

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <div className="text-sm text-gray-600">
            Welcome,{" "}

            <span className="font-semibold">
              {user?.name}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">
              Total Clients
            </h3>

            <p className="text-3xl font-bold mt-2">
              120
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">
              Total Lawyers
            </h3>

            <p className="text-3xl font-bold mt-2">
              45
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">
              Active Cases
            </h3>

            <p className="text-3xl font-bold mt-2">
              32
            </p>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-2xl shadow">

          <h2 className="text-xl font-semibold mb-3">
            Recent Activity
          </h2>

          <p className="text-gray-500">
            Later you can show:
          </p>

          <ul className="mt-3 space-y-2 text-gray-600 list-disc list-inside">
            <li>New lawyer approvals</li>
            <li>New client registrations</li>
            <li>Recent case requests</li>
            <li>Payments and reports</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default AdminHome;