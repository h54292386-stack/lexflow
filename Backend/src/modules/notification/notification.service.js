import AppError from
"../../shared/utils/AppError.js";

import {
  findNotificationsByUser,
  findNotificationById,
  saveNotification,
} from "./notification.repository.js";

export const getNotificationsService =
  async (userId) => {

    return await findNotificationsByUser(
      userId
    );
  };

export const markNotificationReadService =
  async (notificationId) => {

    const notification =
      await findNotificationById(
        notificationId
      );

    if (!notification) {

      throw new AppError(
        "Notification not found",
        404
      );
    }

    notification.isRead = true;

    await saveNotification(
      notification
    );

    return notification;
  };