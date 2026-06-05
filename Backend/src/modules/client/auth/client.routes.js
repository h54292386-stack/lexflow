import express from "express";
import { registerClientController, loginClientController, googleLoginClient, logoutClientController, getClientProfile } from "./client.controller.js";
import { authenticateUser } from "../../../shared/middleware/auth.middleware.js";
import { authLimiter } from "../../../shared/middleware/rateLimiter.js";
import { refreshTokenController } from "../../auth/refreshToken.controller.js"; 
import { verifyOTPController,resendOTPController } from "./client.controller.js";
import { authorizeRoles } from "../../../shared/middleware/authorizeRoles.js";

const router = express.Router();


router.post("/register", registerClientController);
router.post("/login", authLimiter, loginClientController);
router.post("/verify-otp", verifyOTPController);
router.post("/resend-otp", resendOTPController);

router.post("/google", googleLoginClient);
router.post("/refresh-token", refreshTokenController);

router.use(authenticateUser);
router.use(authorizeRoles("client"));

router.get("/me", (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

router.get("/profile", getClientProfile);


router.delete("/logout", logoutClientController);

export default router;