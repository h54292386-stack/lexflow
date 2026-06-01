import { asyncHandler }
    from "../../../shared/middleware/asyncHandler.js";

import { sendResponse }
    from "../../../shared/utils/response.js";

import {
    getPendingLawyersService,
    approveLawyerService,
    rejectLawyerService,
} from "./admin.lawyer.service.js";
import Notification from "../../notification/notification.model.js";
import {
    getIO,
    getOnlineUsers,
} from "../../../socket/socket.js";

export const getPendingLawyersController =
    asyncHandler(async (
        req,
        res
    ) => {

        const lawyers =
            await getPendingLawyersService();

        sendResponse(
            res,
            200,
            true,
            "Pending lawyers fetched",
            { data: lawyers }
        );

    });

export const approveLawyerController =
    asyncHandler(async (req, res) => {

        const lawyer =
            await approveLawyerService(
                req.params.id
            );

        // Save notification
        await Notification.create({
            userId: lawyer._id,
            userModel: "Lawyer",
            title: "Verification Approved",
            message:
                "Your lawyer verification has been approved.",
        });

        // Real-time notification
        const io = getIO();

        const onlineUsers =
            getOnlineUsers();

        const sockets =
            onlineUsers.get(
                lawyer._id.toString()
            );

        if (sockets) {

            sockets.forEach(
                (socketId) => {

                    io.to(socketId).emit(
                        "notification",
                        {
                            type: "success",
                            title:
                                "Verification Approved",
                            message:
                                "Your lawyer verification has been approved.",
                        }
                    );
                }
            );
        }

        sendResponse(
            res,
            200,
            true,
            "Lawyer approved successfully",
            { data: lawyer }
        );
    });



export const rejectLawyerController =
    asyncHandler(async (req, res) => {

        const lawyer =
            await rejectLawyerService(
                req.params.id
            );

        await Notification.create({
            userId: lawyer._id,
            userModel: "Lawyer",
            title: "Verification Rejected",
            message:
                "Your lawyer verification request has been rejected.",
        });

        const io = getIO();

        const onlineUsers =
            getOnlineUsers();

        const sockets =
            onlineUsers.get(
                lawyer._id.toString()
            );

        if (sockets) {

            sockets.forEach(
                (socketId) => {

                    io.to(socketId).emit(
                        "notification",
                        {
                            type: "error",
                            title:
                                "Verification Rejected",
                            message:
                                "Your lawyer verification request has been rejected.",
                        }
                    );
                }
            );
        }

        sendResponse(
            res,
            200,
            true,
            "Lawyer rejected successfully",
            { data: lawyer }
        );
    });