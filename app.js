import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export const app = express();

// ✅ CORS Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// ✅ Import Routes
import authRouter from "./src/routes/auth.routes.js";
import problemRouter from "./src/routes/problem.routes.js";
import submissionRouter from "./src/routes/submission.routes.js";

// ✅ Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/problems", problemRouter);
app.use("/api/v1/submissions", submissionRouter);

// ✅ Health Check Route
app.get("/api/v1/healthcheck", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running!",
  });
});

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("Welcome to LeetCode Clone API!");
});

export default app;