import Notification from "./notification.model.js";

export const findNotificationsByUser =
  async (userId) => {

    return Notification.find({
      userId,
    }).sort({
      createdAt: -1,
    });
  };

export const findNotificationById =
  async (id) => {

    return Notification.findById(id);
  };

export const saveNotification =
  async (notification) => {

    return notification.save();
  };