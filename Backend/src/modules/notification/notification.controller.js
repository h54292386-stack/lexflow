import { asyncHandler }
from "../../shared/middleware/asyncHandler.js";

import { sendResponse }
from "../../shared/utils/response.js";

import {
  getNotificationsService,
  markNotificationReadService,
} from "./notification.service.js";

export const getNotificationsController =
  asyncHandler(async (
    req,
    res
  ) => {


    const notifications =
      await getNotificationsService(
        req.user.id
      );

    sendResponse(
      res,
      200,
      true,
      "Notifications fetched",
      {
        data: notifications,
      }
    );
  });

export const markNotificationReadController =
  asyncHandler(async (
    req,
    res
  ) => {

    const notification =
      await markNotificationReadService(
        req.params.id
      );

    sendResponse(
      res,
      200,
      true,
      "Notification marked as read",
      {
        data: notification,
      }
    );
  });

  export const markAllNotificationsReadController =
  asyncHandler(async (req, res) => {
    await Notification.updateMany(
      { userId: req.user.id },
      { isRead: true }
    );

    sendResponse(
      res,
      200,
      true,
      "All notifications marked as read"
    );
  });
