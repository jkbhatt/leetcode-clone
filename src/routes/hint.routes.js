import express from "express";
import { getHint } from "../controllers/hint.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, getHint);

export default router;