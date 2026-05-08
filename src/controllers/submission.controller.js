import axios from "axios";
import { Problem } from "../models/problem.model.js";
import { Submission } from "../models/submission.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Judge0 Language IDs
const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
};

// ✅ Helper: Execute code using Judge0 API
const executeWithJudge0 = async (code, language, stdin) => {
  const languageId = LANGUAGE_IDS[language];

  if (!languageId) {
    throw new ApiError(400, "Invalid language");
  }

  const response = await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`,
    {
      source_code: code,
      language_id: languageId,
      stdin: stdin || "",
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
    }
  );

  return response.data;
};

// ✅ Helper: Parse Judge0 result
const parseResult = (result) => {
  // Status IDs:
  // 3 = Accepted
  // 4 = Wrong Answer
  // 5 = Time Limit Exceeded
  // 6 = Compilation Error
  // 7-12 = Runtime Error

  if (result.status?.id === 6) {
    return {
      status: "Compilation Error",
      output: "",
      error: result.compile_output || "Compilation Error",
    };
  }

  if (result.status?.id >= 7 && result.status?.id <= 12) {
    return {
      status: "Runtime Error",
      output: "",
      error: result.stderr || "Runtime Error",
    };
  }

  if (result.status?.id === 5) {
    return {
      status: "Time Limit Exceeded",
      output: "",
      error: "Time Limit Exceeded",
    };
  }

  return {
    status: "Success",
    output: result.stdout || "",
    error: result.stderr || null,
  };
};

// ✅ Run code (without saving - just test with examples)
export const runCode = asyncHandler(async (req, res) => {
  const { code, language, problemId } = req.body;

  if (!code || !language || !problemId) {
    throw new ApiError(400, "Code, language and problemId are required");
  }

  const problem = await Problem.findById(problemId);
  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  if (!LANGUAGE_IDS[language]) {
    throw new ApiError(400, "Invalid language");
  }

  const exampleTestCases = problem.testCases.slice(0, 2);
  const results = [];

  for (const testCase of exampleTestCases) {
    try {
      const judge0Result = await executeWithJudge0(code, language, testCase.input);
      const parsed = parseResult(judge0Result);

      const actualOutput = parsed.output.trim();
      const expectedOutput = testCase.output?.trim();
      const passed = parsed.status === "Success" && actualOutput === expectedOutput;

      results.push({
        input: testCase.input,
        expectedOutput: expectedOutput,
        actualOutput: actualOutput || parsed.error || "No output",
        status: parsed.status,
        passed,
        error: parsed.error,
      });
    } catch (error) {
      results.push({
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput: "",
        status: "Runtime Error",
        passed: false,
        error: error.message,
      });
    }
  }

  return res.status(200).json(
    new ApiResponse(200, { results }, "Code executed successfully!")
  );
});

// ✅ Submit code (save to DB + judge all hidden test cases)
export const submitCode = asyncHandler(async (req, res) => {
  const { code, language, problemId } = req.body;

  if (!code || !language || !problemId) {
    throw new ApiError(400, "Code, language and problemId are required");
  }

  const problem = await Problem.findById(problemId);
  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  if (!LANGUAGE_IDS[language]) {
    throw new ApiError(400, "Invalid language");
  }

  const submission = await Submission.create({
    user: req.user._id,
    problem: problemId,
    code,
    language,
    status: "Pending",
    totalTestCases: problem.testCases.length,
  });

  let passedCount = 0;
  let finalStatus = "Accepted";
  let totalRuntime = 0;

  for (const testCase of problem.testCases) {
    try {
      const startTime = Date.now();
      const judge0Result = await executeWithJudge0(code, language, testCase.input);
      const endTime = Date.now();
      const runtime = endTime - startTime;

      const parsed = parseResult(judge0Result);

      if (parsed.status === "Compilation Error") {
        finalStatus = "Compilation Error";
        break;
      }

      if (parsed.status === "Runtime Error") {
        finalStatus = "Runtime Error";
        break;
      }

      if (parsed.status === "Time Limit Exceeded") {
        finalStatus = "Time Limit Exceeded";
        break;
      }

      const actualOutput = parsed.output.trim();
      const expectedOutput = testCase.output?.trim();
      const passed = actualOutput === expectedOutput;

      if (passed) {
        passedCount++;
        totalRuntime += runtime;
      } else {
        finalStatus = "Wrong Answer";
        break;
      }
    } catch (error) {
      finalStatus = "Runtime Error";
      break;
    }
  }

  if (passedCount === problem.testCases.length) {
    finalStatus = "Accepted";
    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { solvedProblems: problemId } },
      { new: true }
    );
    await Problem.findByIdAndUpdate(problemId, { $inc: { solved: 1 } });
  }

  const updatedSubmission = await Submission.findByIdAndUpdate(
    submission._id,
    {
      status: finalStatus,
      testCasesPassed: passedCount,
      runtime: passedCount > 0 ? Math.round(totalRuntime / passedCount) : 0,
    },
    { new: true }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        submission: updatedSubmission,
        totalTestCases: problem.testCases.length,
        testCasesPassed: passedCount,
      },
      finalStatus
    )
  );
});

// ✅ Get my submissions for a problem
export const getMySubmissions = asyncHandler(async (req, res) => {
  const { problemId } = req.params;

  const submissions = await Submission.find({
    user: req.user._id,
    problem: problemId,
  }).sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, { submissions }, "Submissions fetched successfully!")
  );
});

// ✅ Get all submissions (admin only)
export const getAllSubmissions = asyncHandler(async (req, res) => {
  const submissions = await Submission.find()
    .populate("user", "username email")
    .populate("problem", "title difficulty")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, { submissions }, "All submissions fetched!")
  );
});
