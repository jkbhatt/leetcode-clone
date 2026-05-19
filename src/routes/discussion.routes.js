import express from "express";
import {
  getDiscussions,
  createDiscussion,
  toggleUpvote,
  addReply,
  deleteDiscussion,
} from "../controllers/discussion.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router({ mergeParams: true });

// All routes need login
router.use(verifyJWT);

router.get("/", getDiscussions);
router.post("/", createDiscussion);
router.post("/:discussionId/upvote", toggleUpvote);
router.post("/:discussionId/reply", addReply);
router.delete("/:discussionId", deleteDiscussion);

export default router;