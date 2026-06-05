import express from "express";
import { createCase, updateCaseDetails, uploadDocuments, requestLawyer, getDraftCase, getClientCases, getCaseById, deleteCaseDoc } from "./case.controller.js";
import { authenticateUser } from "../../../shared/middleware/auth.middleware.js";
import { upload } from "../../../shared/utils/multer.js";
import { authorizeRoles } from "../../../shared/middleware/authorizeRoles.js";

const router = express.Router();
router.use(authenticateUser);
router.use(authorizeRoles("client"));

router.post("/create", createCase);
router.get("/draft", getDraftCase);
router.get("/cases", getClientCases);

router.put("/:caseId/details", updateCaseDetails);

router.post(
  "/:caseId/documents",
  upload.array("files", 5),
  uploadDocuments
);
router.post("/request/:caseId", requestLawyer);
router.get("/:caseId", getCaseById);
router.delete(
  "/:caseId/document/:docId",
  deleteCaseDoc
);
export default router;