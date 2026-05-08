import express from "express";
import {
  runCode,
  submitCode,
  getMySubmissions,
  getAllSubmissions,
} from "../controllers/submission.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

// ✅ Run code
router.post("/run", verifyJWT, runCode);

// ✅ Submit code
router.post("/submit", verifyJWT, submitCode);

// ✅ Get my submissions for a problem
router.get("/:problemId", verifyJWT, getMySubmissions);

// ✅ Get all submissions (admin only)
router.get("/all", verifyJWT, verifyAdmin, getAllSubmissions);

export default router;