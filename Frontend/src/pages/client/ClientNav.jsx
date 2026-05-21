import { MdBalance } from "react-icons/md";
import { FaBell, FaUserCircle, FaComments } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  logoutClient,
  getClientProfile,
  getUserConversations,
} from "../../service/AuthService.js";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ClientNavbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { logout } = useAuth();
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getClientProfile();
        setUser(res.user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const res = await getUserConversations();

        const conversations = res.conversations || [];

        let totalUnread = 0;

        conversations.forEach((conv) => {
          totalUnread += conv.unreadCount || 0;
        });

        setUnreadCount(totalUnread);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUnreadMessages();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutClient();

      logout();

      toast.success("Logged out successfully");

      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-white shadow-sm">
      <div className="flex items-center gap-2 font-bold text-lg">
        <MdBalance size={28} />
        LexFlow
      </div>

      <ul className="flex gap-8 text-gray-600 text-sm">
        <li className="hover:text-black cursor-pointer">
          <Link to="/howitworking">Home</Link>
        </li>
        <li className="hover:text-black cursor-pointer">
          <Link to="/cases">Cases</Link>
        </li>
        <li className="hover:text-black cursor-pointer">
          <Link to="/createCase">Register New Case</Link>
        </li>
        <li className="hover:text-black cursor-pointer">
          <Link to="/lawyers">Lawyers</Link>
        </li>
      </ul>

      <div className="flex items-center gap-5">
        <Link to="/chat">
          <div className="relative">
            <FaComments className="text-lg cursor-pointer hover:text-blue-600" />

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </Link>

        <div className="relative">
          <FaBell className="text-lg cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
            3
          </span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <FaUserCircle
            className="text-2xl cursor-pointer"
            onClick={() => setOpen(!open)}
          />

          {open && (
            <div className="absolute right-0 mt-3 w-40 bg-white shadow-lg rounded-lg py-2 z-50">
              <span className="text-sm font-medium text-gray-700">
                {user?.name || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
