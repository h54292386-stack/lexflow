import express from "express";
import { registerClientController, loginClientController, googleLoginClient, logoutClientController, getClientProfile } from "./client.controller.js";
import { authenticateUser } from "../../../shared/middleware/auth.middleware.js";
import { authLimiter } from "../../../shared/middleware/rateLimiter.js";
import { refreshTokenController } from "../../auth/refreshToken.controller.js"; 
import { verifyOTPController,resendOTPController } from "./client.controller.js";

const router = express.Router();


router.post("/register", registerClientController);
router.post("/login", authLimiter, loginClientController);
router.post("/verify-otp", verifyOTPController);
router.post("/resend-otp", resendOTPController);

router.post("/google", googleLoginClient);
router.post("/refresh-token", refreshTokenController);


router.get("/me", authenticateUser, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

router.get("/profile", authenticateUser, getClientProfile);


router.delete("/logout", authenticateUser, logoutClientController);

export default router;