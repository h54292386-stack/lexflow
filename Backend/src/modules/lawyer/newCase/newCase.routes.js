import express from "express";
import { authenticateUser } from "../../../shared/middleware/auth.middleware.js";
import { getRequestedCases, acceptCaseRequest, showInterest, declineCase ,  submitProposal} from "./newCase.controller.js";
import { authorizeRoles } from "../../../shared/middleware/authorizeRoles.js";

const router = express.Router();
router.use(authenticateUser);
router.use(authorizeRoles("lawyer"));

router.get(
  "/requested",
  getRequestedCases
);

router.put(
  "/:caseId/accept",
  acceptCaseRequest
);

router.post(
  "/:caseId/proposal",
  submitProposal
);

router.put(
  "/:caseId/interest",
  showInterest
);

router.put(
  "/:caseId/decline",
  declineCase
);
export default router;