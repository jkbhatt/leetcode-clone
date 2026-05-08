import express from "express";
import cors from "cors"; // Cross-Origin Resource Sharing
import cookieParser from "cookie-parser";

export const app = express();

// ✅ CORS first
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Middlewares
app.use(express.json()); 
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// ✅ Import routes
import authRouter from "./src/routes/auth.routes.js";
import problemRouter from "./src/routes/problem.routes.js";
import submissionRouter from "./src/routes/submission.routes.js";

// ✅ Use routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/problems", problemRouter);
app.use("/api/v1/submissions", submissionRouter);

// ✅ Health check
app.get("/api/v1/healthcheck", (req, res) => {
  res.json({ success: true, message: "Server is running!" });
});

app.get("/", (req, res) => {
  res.send("Welcome to LeetCode Clone API!");
});

export default app;