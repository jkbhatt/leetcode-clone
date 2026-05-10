import express from "express";
import {
  getAllProblems,
  getProblemById,
  addProblem,
  updateProblem,
  deleteProblem,
  getSolvedProblems,
  getLeaderboard,
} from "../controllers/problem.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

// ✅ Public routes
router.get("/", getAllProblems);

// ✅ Protected routes
router.get("/solved", verifyJWT, getSolvedProblems);
router.get("/:id", verifyJWT, getProblemById);

// ✅ Admin routes
router.post("/", verifyJWT, verifyAdmin, addProblem);

router.put(
  "/:id",
  verifyJWT,
  verifyAdmin,
  updateProblem
);

router.delete(
  "/:id",
  verifyJWT,
  verifyAdmin,
  deleteProblem
);

// ✅ Leaderboard
router.get(
  "/leaderboard/all",
  verifyJWT,
  getLeaderboard
);

export default router;