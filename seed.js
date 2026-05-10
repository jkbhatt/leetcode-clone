import mongoose from "mongoose";
import dotenv from "dotenv";
import { Problem } from "./src/models/problem.model.js";

dotenv.config();

const problems = [
  {
    title: "Two Sum",
    description: "Find indices of two numbers that add up to target.",
    difficulty: "Easy",
    tags: ["Array", "HashMap"],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "nums[0] + nums[1] = 9"
      }
    ],
    constraints: "2 <= nums.length <= 104",
    testCases: [
      {
        input: "[2,7,11,15],9",
        output: "[0,1]"
      }
    ]
  },
  {
    title: "Palindrome Number",
    description: "Check whether an integer is palindrome.",
    difficulty: "Easy",
    tags: ["Math"],
    examples: [
      {
        input: "121",
        output: "true",
        explanation: "121 reads same backward."
      }
    ],
    constraints: "-231 <= x <= 231 - 1",
    testCases: [
      {
        input: "121",
        output: "true"
      }
    ]
  },
  {
    title: "Maximum Subarray",
    description: "Find contiguous subarray with largest sum.",
    difficulty: "Medium",
    tags: ["Array", "DP"],
    examples: [
      {
        input: "[-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "[4,-1,2,1] has largest sum."
      }
    ],
    constraints: "1 <= nums.length <= 105",
    testCases: [
      {
        input: "[-2,1,-3,4,-1,2,1,-5,4]",
        output: "6"
      }
    ]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Problem.deleteMany();

    await Problem.insertMany(problems);

    console.log("Problems seeded successfully");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedDB();