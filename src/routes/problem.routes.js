import express from "express";
import {
  getAllProblems,
  getProblemById,
  addProblem,
  updateProblem,
  deleteProblem,
  getSolvedProblems,
} from "../controllers/problem.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

// ✅ Public routes
router.get("/", getAllProblems);

// ✅ Protected routes (login required)
router.get("/solved", verifyJWT, getSolvedProblems);
router.get("/:id", verifyJWT, getProblemById);

// ✅ Admin only routes
router.post("/", verifyJWT, verifyAdmin, addProblem);
router.put("/:id", verifyJWT, verifyAdmin, updateProblem);
router.delete("/:id", verifyJWT, verifyAdmin, deleteProblem);

export default router;