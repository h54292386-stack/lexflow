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

import { NavLink } from "react-router-dom";

export default function Sidebar() {
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
      path: "/lawyer/new-cases",
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

  return (
    <div className="w-72 min-h-screen bg-black text-white flex flex-col border-r border-gray-800">

      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-3xl font-bold tracking-wide text-white">
          LexFlow
        </h1>
      </div>

      {/* Lawyer Profile */}
      <div className="flex items-center gap-4 p-6 border-b border-gray-800">

        <img
          src="https://i.pravatar.cc/100"
          alt="lawyer"
          className="w-16 h-16 rounded-full object-cover border-2 border-white"
        />

        <div>
          <h2 className="font-semibold text-lg text-white">
            Sarah Johnson
          </h2>

          <p className="text-sm text-gray-400">
            Property Lawyer
          </p>
        </div>
      </div>

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
            <span className="text-lg">
              {item.icon}
            </span>

            <span className="font-medium">
              {item.name}
            </span>
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