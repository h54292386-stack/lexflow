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
      // Wait until user loads
      if (!user?._id) return;

      try {
        const res = await getUserConversations(user._id);

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
  }, [user]);

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

      <div className="flex items-center gap-7 mr-6">
        <Link to="/chat">
          <div className="relative">
            <FaComments className="text-[20px] cursor-pointer hover:text-blue-600 transition" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </Link>

        <div className="relative">
          <FaBell className="text-[19px] cursor-pointer hover:text-black transition" />{" "}
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
            3
          </span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <div onClick={() => setOpen(!open)} className="cursor-pointer">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-gray-800"
              />
            ) : (
              <FaUserCircle className="text-3xl" />
            )}
          </div>

          {open && (
            <div className="absolute right-0 mt-3 w-52 bg-white shadow-xl rounded-xl py-2 z-50 border">
              <div className="px-4 py-3 border-b">
                <p className="font-semibold text-sm">{user?.name || "User"}</p>

                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>

              <Link
                to="/profile"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                My Profile
              </Link>
              <Link
                to="/change-password"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Change Password
              </Link>

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
