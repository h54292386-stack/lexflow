import express from "express";
import { registerLawyerController, loginLawyerController, logoutLawyerController,googleLoginLawyer ,submitDocumentsController} from "./lawyer.controller.js";
import { authenticateUser } from "../../../shared/middleware/auth.middleware.js";
import { authLimiter } from "../../../shared/middleware/rateLimiter.js";
import { refreshTokenController } from "../../auth/refreshToken.controller.js";
import { requireApprovedLawyer } from "../../../shared/middleware/approvedLawyer.middleware.js";
import { verifyOTPController,resendOTPController } from "./lawyer.controller.js";
import { authorizeRoles } from "../../../shared/middleware/authorizeRoles.js";

const router = express.Router();


router.post("/register", registerLawyerController);
router.post("/login", authLimiter, loginLawyerController);
router.post("/verify-otp", verifyOTPController);
router.post("/resend-otp", resendOTPController);

router.post("/google", googleLoginLawyer);
router.post("/refresh-token", refreshTokenController);

router.use(authenticateUser);
router.use(authorizeRoles("lawyer"));

router.get("/me", (req, res) => {
  res.json({
    success: true,
    lawyer: req.user
  });
});

router.post("/submit-documents", submitDocumentsController);
router.get("/dashboard",requireApprovedLawyer,(req, res) => {
    res.json({
      success: true,
      message: "Welcome to REAL lawyer dashboard"
    });
  }
);

router.delete("/logout", logoutLawyerController);


export default router;