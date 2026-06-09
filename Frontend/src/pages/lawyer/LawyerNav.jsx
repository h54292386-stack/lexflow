import { MdBalance } from "react-icons/md";
import { FaBell, FaUserCircle, FaComments } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  getLawyerProfile,
  getNotifications,
  logoutLawyer,
  markAllNotificationsRead,
} from "../../service/AuthService.js";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import { getSocket } from "../../socket.js";

export default function LawyerNavbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
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
        const res = await getLawyerProfile();
        setUser(res.user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications();

        setNotifications(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const socket = getSocket();

    if (socket) {
      // Listen for the incoming real-time notification
      socket.on("notification", (newNotification) => {
        // 1. Update the dropdown list dynamically (add the new notification to the top)
        setNotifications((prevNotifications) => [
          newNotification,
          ...prevNotifications,
        ]);

        // 2. (Optional) Show a toast alert to the lawyer immediately
        toast(newNotification.message, {
          icon: newNotification.type === "success" ? "✅" : "❌",
        });
      });

      // Cleanup listener on unmount
      return () => {
        socket.off("notification");
      };
    }
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearNotifications = async () => {
    try {
      await clearAllNotifications(); // backend API

      setNotifications([]);
      setShowNotifications(false);

      toast.success("Notifications cleared");
    } catch (err) {
      console.log(err);
      toast.error("Failed to clear notifications");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutLawyer();

      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("role");

      logout?.();

      toast.success("Logged out successfully");

      navigate("/lawyer/login");
    } catch (error) {
      console.error(error);
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
          <Link to="/">Home</Link>
        </li>
        <li className="hover:text-black cursor-pointer">
          <Link to="/"></Link>
        </li>
        <li className="hover:text-black cursor-pointer">
          <Link to="/"></Link>
        </li>
        <li className="hover:text-black cursor-pointer">
          <Link to="/"></Link>
        </li>
      </ul>

      <div className="flex items-center gap-7 mr-6">
        <Link to="/">
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
          <FaBell
            onClick={async () => {
              setShowNotifications((prev) => !prev);

              try {
                await markAllNotificationsRead();

                setNotifications((prev) =>
                  prev.map((n) => ({ ...n, isRead: true })),
                );
              } catch (err) {
                console.log(err);
              }
            }}
            className="text-[19px] cursor-pointer hover:text-black transition"
          />{" "}
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
              {unreadCount}
            </span>
          )}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white shadow-lg rounded-xl border z-50 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-gray-500">No notifications</div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 border-b ${
                      !notification.isRead ? "bg-blue-50" : ""
                    }`}
                  >
                    <h4 className="font-semibold">{notification.title}</h4>

                    <p className="text-sm text-gray-600">
                      {notification.message}
                    </p>
                   <button
                  onClick={clearNotifications}
                  className="text-red-500 text-sm hover:underline"
                >
                  Clear All
                </button>
                </div>
                    
              
                ))
              )}
              <div className="border-t p-2 text-center">
                <Link
                  to="/lawyer/notifications"
                  className="text-blue-600 text-sm hover:underline"
                >
                  View All Notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 cursor-pointer"
          >
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
