import express from "express";
import { adminLogin,   registerAdmin,
} from "./admin.controller.js";
import { refreshTokenController } from "../../auth/refreshToken.controller.js";
import { authenticateUser } from "../../../shared/middleware/auth.middleware.js";
import { authorizeRoles } from "../../../shared/middleware/authorizeRoles.js";

const router = express.Router();

router.post(
  "/register",
  registerAdmin
);

router.post("/login", adminLogin);

router.post( "/refresh-token",refreshTokenController);

router.use(authenticateUser);
router.use(authorizeRoles("admin"));

export default router;