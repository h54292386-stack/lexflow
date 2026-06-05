import express from "express";
import { getAllLawyers,getLawyerById } from "./controller.js";
import { authenticateUser } from "../../../shared/middleware/auth.middleware.js";
import { authorizeRoles } from "../../../shared/middleware/authorizeRoles.js";


const router = express.Router();

router.use(authenticateUser);
router.use(authorizeRoles("client"));

router.get("/", getAllLawyers);
router.get("/:lawyerId", getLawyerById);

export default router;