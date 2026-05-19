import Groq from "groq-sdk";
import { Problem } from "../models/problem.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getHint = asyncHandler(async (req, res) => {
  const { problemId, userCode, language, hintLevel } = req.body;

  // ✅ Initialize inside function
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

  if (!problemId) {
    throw new ApiError(400, "Problem ID is required");
  }

  const problem = await Problem.findById(problemId);
  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  const hintLevelText = {
    1: "Give a very gentle hint. Just point them in the right direction without revealing the approach.",
    2: "Give a medium hint. Suggest the algorithm or data structure to use without showing code.",
    3: "Give a strong hint. Explain the approach clearly but dont write the actual code.",
  };

  const prompt = `You are a helpful coding mentor for a LeetCode-style platform.

Problem Title: ${problem.title}
Problem Description: ${problem.description}
Difficulty: ${problem.difficulty}
Tags: ${problem.tags.join(", ")}

${userCode ? `User's Current Code (${language}):
\`\`\`${language}
${userCode}
\`\`\`` : "User has not written any code yet."}

${hintLevelText[hintLevel] || hintLevelText[1]}

Provide hints in this EXACT JSON format (no other text):
{
  "logicHint": "hint about how to think about the problem",
  "complexityHint": "hint about expected time/space complexity",
  "edgeCaseHint": "hint about edge cases to consider",
  "encouragement": "a short encouraging message"
}

Rules:
- Do NOT write actual solution code
- Do NOT give away the complete solution
- Keep each hint to 1-2 sentences
- Be encouraging and supportive
- Return ONLY the JSON object`;

  // ✅ Groq API call
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 500,
  });

  const responseText = response.choices[0].message.content;

  // Clean response
  const cleanResponse = responseText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  // Parse JSON
  let hints;
  try {
    hints = JSON.parse(cleanResponse);
  } catch {
    hints = {
      logicHint: "Think about what data structure would help you look up values quickly.",
      complexityHint: "Aim for O(n) time complexity.",
      edgeCaseHint: "Consider empty arrays and duplicate values.",
      encouragement: "You are doing great! Keep thinking!",
    };
  }

  return res.status(200).json(
    new ApiResponse(200, { hints, hintLevel }, "Hint generated!")
  );
});