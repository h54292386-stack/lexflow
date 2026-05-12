import express from "express";
import { createCase, updateCaseDetails, uploadDocuments,requestLawyer,getDraftCase,getClientCases,getCaseById} from "./case.controller.js";
import { authenticateUser } from "../../../shared/middleware/auth.middleware.js";
import { upload } from "../../../shared/utils/multer.js";

const router = express.Router();

router.post("/create", authenticateUser,createCase);
router.get("/draft", authenticateUser, getDraftCase);
router.get("/cases", authenticateUser, getClientCases);

router.put("/:caseId/details", authenticateUser, updateCaseDetails);

router.post(
  "/:caseId/documents",
  authenticateUser,
  upload.array("files", 5),
  uploadDocuments
);
router.post("/request/:caseId", authenticateUser, requestLawyer);
router.get("/:caseId", authenticateUser, getCaseById);

export default router;