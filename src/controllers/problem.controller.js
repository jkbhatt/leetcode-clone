import { Problem } from "../models/problem.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Get all problems (public)
export const getAllProblems = asyncHandler(async (req, res) => {
  const { difficulty, tag, search } = req.query;

  // ✅ Pagination parameters
  const page = parseInt(req.query.page) || 1;   // current page (default 1)
  const limit = parseInt(req.query.limit) || 10; // items per page (default 10)
  const skip = (page - 1) * limit;               // how many to skip

  // Build filter
  const filter = {};
  if (difficulty) filter.difficulty = difficulty;
  if (tag) filter.tags = { $in: [tag] };
  if (search) filter.title = { $regex: search, $options: "i" };

  // ✅ Get total count for pagination info
  const totalProblems = await Problem.countDocuments(filter);
  const totalPages = Math.ceil(totalProblems / limit);

  // ✅ Get paginated problems
  const problems = await Problem.find(filter)
    .select("-testCases -starterCode")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        problems,
        pagination: {
          currentPage: page,
          totalPages,
          totalProblems,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit,
        },
      },
      "Problems fetched successfully!"
    )
  );
});

// ✅ Get single problem (protected)
export const getProblemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const problem = await Problem.findById(id);

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  // Check if current user has solved this problem
  const user = await User.findById(req.user._id);
  const isSolved = user.solvedProblems.includes(id);

  return res.status(200).json(
    new ApiResponse(
      200,
      { problem, isSolved },
      "Problem fetched successfully!"
    )
  );
});

// ✅ Add problem (admin only)
export const addProblem = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testCases,
    starterCode,
  } = req.body;

  // Validate required fields
  if (!title || !description || !difficulty) {
    throw new ApiError(400, "Title, description and difficulty are required");
  }

  // Check if problem with same title exists
  const existingProblem = await Problem.findOne({ title });
  if (existingProblem) {
    throw new ApiError(400, "Problem with this title already exists");
  }

  // Validate test cases
  if (!testCases || testCases.length === 0) {
    throw new ApiError(400, "At least one test case is required");
  }

  const problem = await Problem.create({
    title,
    description,
    difficulty,
    tags: tags || [],
    examples: examples || [],
    constraints: constraints || "",
    testCases,
    starterCode: starterCode || {},
    createdBy: req.user._id,
  });

  return res.status(201).json(
    new ApiResponse(201, { problem }, "Problem added successfully!")
  );
});

// ✅ Update problem (admin only)
export const updateProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const problem = await Problem.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true } // return updated document
  );

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  return res.status(200).json(
    new ApiResponse(200, { problem }, "Problem updated successfully!")
  );
});

// ✅ Delete problem (admin only)
export const deleteProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const problem = await Problem.findByIdAndDelete(id);

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  return res.status(200).json(
    new ApiResponse(200, null, "Problem deleted successfully!")
  );
});

// ✅ Get problems solved by user
export const getSolvedProblems = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "solvedProblems",
    "title difficulty tags"
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      { solvedProblems: user.solvedProblems },
      "Solved problems fetched!"
    )
  );
});
// ✅ Get leaderboard
export const getLeaderboard = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select("username avatar solvedProblems createdAt")
    .sort({ "solvedProblems": -1 })
    .limit(20);

  const leaderboard = users.map((user, index) => ({
    rank: index + 1,
    username: user.username,
    solved: user.solvedProblems.length,
    createdAt: user.createdAt,
  }));

  return res.status(200).json(
    new ApiResponse(200, { leaderboard }, "Leaderboard fetched!")
  );
});