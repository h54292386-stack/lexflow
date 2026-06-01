import express from "express";
import { adminLogin,   registerAdmin,
} from "./admin.controller.js";
import { refreshTokenController } from "../../auth/refreshToken.controller.js";

const router = express.Router();

router.post(
  "/register",
  registerAdmin
);


router.post("/login", adminLogin);

router.post( "/refresh-token",refreshTokenController);

export default router;