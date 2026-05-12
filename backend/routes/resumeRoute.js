import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  createResumeBasedSession,
  getResumeProfiles,
  getResumeProfileBySession,
} from "../controller/resumeController.js";

const router = express.Router();

router.post(
  "/session",
  protect,
  upload.single("resume"),
  createResumeBasedSession
);

router.get("/", protect, getResumeProfiles);
router.get("/:sessionId", protect, getResumeProfileBySession);

export default router;