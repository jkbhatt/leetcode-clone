import { Discussion } from "../models/discussion.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Get all discussions for a problem
export const getDiscussions = asyncHandler(async (req, res) => {
  const { problemId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const discussions = await Discussion.find({ problem: problemId })
    .populate("author", "username avatar")
    .populate("replies.author", "username avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Discussion.countDocuments({ problem: problemId });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        discussions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total,
          hasNextPage: page < Math.ceil(total / limit),
        },
      },
      "Discussions fetched!"
    )
  );
});

// ✅ Create discussion
export const createDiscussion = asyncHandler(async (req, res) => {
  const { problemId } = req.params;
  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    throw new ApiError(400, "Content is required");
  }

  const discussion = await Discussion.create({
    problem: problemId,
    author: req.user._id,
    content: content.trim(),
  });

  // Populate author info
  await discussion.populate("author", "username avatar");

  return res.status(201).json(
    new ApiResponse(201, { discussion }, "Discussion created!")
  );
});

// ✅ Toggle upvote on discussion
export const toggleUpvote = asyncHandler(async (req, res) => {
  const { discussionId } = req.params;
  const userId = req.user._id;

  const discussion = await Discussion.findById(discussionId);
  if (!discussion) {
    throw new ApiError(404, "Discussion not found");
  }

  // Check if already upvoted
  const alreadyUpvoted = discussion.upvotes.includes(userId);

  if (alreadyUpvoted) {
    // Remove upvote
    await Discussion.findByIdAndUpdate(discussionId, {
      $pull: { upvotes: userId },
    });
  } else {
    // Add upvote
    await Discussion.findByIdAndUpdate(discussionId, {
      $addToSet: { upvotes: userId },
    });
  }

  const updated = await Discussion.findById(discussionId);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        upvotes: updated.upvotes.length,
        isUpvoted: !alreadyUpvoted,
      },
      alreadyUpvoted ? "Upvote removed!" : "Upvoted!"
    )
  );
});

// ✅ Add reply to discussion
export const addReply = asyncHandler(async (req, res) => {
  const { discussionId } = req.params;
  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    throw new ApiError(400, "Reply content is required");
  }

  const discussion = await Discussion.findByIdAndUpdate(
    discussionId,
    {
      $push: {
        replies: {
          content: content.trim(),
          author: req.user._id,
        },
      },
    },
    { new: true }
  ).populate("replies.author", "username avatar");

  if (!discussion) {
    throw new ApiError(404, "Discussion not found");
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      { replies: discussion.replies },
      "Reply added!"
    )
  );
});

// ✅ Delete discussion
export const deleteDiscussion = asyncHandler(async (req, res) => {
  const { discussionId } = req.params;

  const discussion = await Discussion.findById(discussionId);
  if (!discussion) {
    throw new ApiError(404, "Discussion not found");
  }

  // Only author or admin can delete
  if (
    discussion.author.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "You can only delete your own comments");
  }

  await Discussion.findByIdAndDelete(discussionId);

  return res.status(200).json(
    new ApiResponse(200, null, "Discussion deleted!")
  );
});