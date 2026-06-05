import {
  FaHome,
  FaBriefcase,
  FaPlusCircle,
  FaCalendarAlt,
  FaComments,
  FaMoneyBillWave,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { NavLink } from "react-router-dom";
import { getLawyerProfile } from "../service/AuthService.js";
import { MdBalance } from "react-icons/md";

export default function Sidebar() {
  const { user } = useAuth();

  const [lawyer, setLawyer] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getLawyerProfile();

        setLawyer(data.user);
      } catch (error) {
        console.error(error);
      }
    };

    loadProfile();
  }, []);

  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/lawyer/dashboard",
    },

    {
      name: "Cases",
      icon: <FaBriefcase />,
      path: "/lawyer/cases",
    },

    {
      name: "New Cases",
      icon: <FaPlusCircle />,
      path: "/lawyer/case-requests",
    },

    {
      name: "Schedule",
      icon: <FaCalendarAlt />,
      path: "/lawyer/schedule",
    },

    {
      name: "Messages",
      icon: <FaComments />,
      path: "/lawyer/messages",
    },

    {
      name: "Earnings",
      icon: <FaMoneyBillWave />,
      path: "/lawyer/earnings",
    },

    {
      name: "Performance",
      icon: <FaChartLine />,
      path: "/lawyer/performance",
    },

    {
      name: "Settings",
      icon: <FaCog />,
      path: "/lawyer/settings",
    },
  ];
  console.log(user);
  return (
    <div className="w-72 min-h-screen bg-black text-white flex flex-col border-r border-gray-800">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-3xl font-bold flex items-center gap-3 tracking-wide text-white">
          {" "}
          <MdBalance size={31} />
          LexFlow
        </h1>
      </div>

      {/* Lawyer Profile */}
  <NavLink
  to="/lawyer/profile"
  className="flex items-center justify-between p-6 border-b border-gray-800 hover:bg-gray-900 transition-colors duration-200"
>
  <div className="flex items-center gap-4">
    <img
      src={
        lawyer?.profileImage ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          lawyer?.name || user?.name || "Lawyer"
        )}`
      }
      alt="lawyer"
      className="w-16 h-16 rounded-full object-cover border-2 border-white"
    />

    <div>
      <h2 className="font-semibold text-lg text-white">
        {lawyer?.name || user?.name || "Lawyer"}
      </h2>

      <p className="text-sm text-gray-400">
        {lawyer?.specialization?.join(", ") || "Advocate"}
      </p>
    </div>
  </div>

</NavLink>

      
      {/* Menu */}
      <div className="flex-1 p-4 flex flex-col gap-2">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
              ${
                isActive
                  ? "bg-white text-black shadow-md"
                  : "hover:bg-gray-900 text-gray-300"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>

            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white hover:text-black transition duration-200 text-gray-300">
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
}
