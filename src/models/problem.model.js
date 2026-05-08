import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    constraints: {
      type: String,
      default: "",
    },
    testCases: [
      {
        input: String,
        output: String,
      },
    ],
    starterCode: {
      javascript: { type: String, default: "// Write your solution here\n" },
      python: { type: String, default: "# Write your solution here\n" },
      java: { type: String, default: "// Write your solution here\n" },
      cpp: { type: String, default: "// Write your solution here\n" },
    },
    solved: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Problem = mongoose.model("Problem", problemSchema);