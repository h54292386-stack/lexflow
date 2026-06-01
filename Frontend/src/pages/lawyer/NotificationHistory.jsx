import { useEffect, useState } from "react";
import { getNotifications } from "../../service/AuthService.js";

export default function NotificationHistory() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await getNotifications();

      setNotifications(res.data.data);
    };

    fetchNotifications();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        Notification History
      </h2>

      {notifications.map((notification) => (
        <div
          key={notification._id}
          className="bg-white shadow rounded-lg p-4 mb-3"
        >
          <h3 className="font-semibold">
            {notification.title}
          </h3>

          <p className="text-gray-600">
            {notification.message}
          </p>

          <p className="text-xs text-gray-400 mt-2">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}