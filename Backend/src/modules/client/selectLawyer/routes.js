import express from "express";
import { getAllLawyers,getLawyerById } from "./controller.js";
import { authenticateUser } from "../../../shared/middleware/auth.middleware.js";


const router = express.Router();

router.get("/", authenticateUser, getAllLawyers);
router.get("/:lawyerId", authenticateUser, getLawyerById);

export default router;