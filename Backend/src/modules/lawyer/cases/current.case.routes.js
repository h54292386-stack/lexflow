import express from "express";

import {
    getLawyerCasesController,
    getSingleCaseController
} from "./current.case.controller.js";

import {  authenticateUser } from "../../../shared/middleware/auth.middleware.js";
import { authorizeRoles } from "../../../shared/middleware/authorizeRoles.js"
const router = express.Router();

router.use(authenticateUser);
router.use(authorizeRoles("lawyer"));

router.get(
    "/",
    getLawyerCasesController
);

router.get(
    "/:id",
    getSingleCaseController
);

export default router;