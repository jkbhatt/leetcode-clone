import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import discussionRouter from "./src/routes/discussion.routes.js";

export const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://leetcode-clone-black.vercel.app",
    "https://leetcode-clone-git-main-jkbhatts-projects.vercel.app",
    "https://leetcode-clone-ek6z84297-jkbhatts-projects.vercel.app",
    "https://leetcode-clone-hwnl1fxpk-jkbhatts-projects.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Middlewares - SECOND
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// ✅ Routes - LAST (all routes after middlewares)
import authRouter from "./src/routes/auth.routes.js";
import problemRouter from "./src/routes/problem.routes.js";
import submissionRouter from "./src/routes/submission.routes.js";
import hintRouter from "./src/routes/hint.routes.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/problems", problemRouter);
app.use("/api/v1/submissions", submissionRouter);
app.use("/api/v1/hints", hintRouter); // ✅ Now AFTER express.json()
app.use("/api/v1/problems/:problemId/discussions", discussionRouter);

// ✅ Health Check Route
app.get("/api/v1/healthcheck", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running!" });
});

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("Welcome to LeetCode Clone API!");
});

export default app;