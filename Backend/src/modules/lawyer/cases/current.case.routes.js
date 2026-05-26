import express from "express";

import {
    getLawyerCasesController,
    getSingleCaseController
} from "./current.case.controller.js";

import {  authenticateUser } from "../../../shared/middleware/auth.middleware.js";
import { authorizeRoles } from "../../../shared/middleware/authorizeRoles.js"
const router = express.Router();

router.get(
    "/",
authenticateUser,
  authorizeRoles("lawyer"),
    getLawyerCasesController
);

router.get(
    "/:id",
authenticateUser,
  authorizeRoles("lawyer"),
    getSingleCaseController
);

export default router;