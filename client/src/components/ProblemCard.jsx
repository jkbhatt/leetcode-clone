import Link from "next/link";
import { CheckCircle } from "lucide-react";

const difficultyColors = {
  Easy: "text-green-400 bg-green-900",
  Medium: "text-yellow-400 bg-yellow-900",
  Hard: "text-red-400 bg-red-900",
};

export default function ProblemCard({ problem, index, isSolved }) {
  return (
    <Link href={`/problems/${problem._id}`}>
      <div className="flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-800 rounded-xl transition cursor-pointer border border-gray-800 hover:border-gray-700">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Problem number */}
          <span className="text-gray-500 text-sm w-8">{index + 1}</span>

          {/* Solved indicator */}
          {isSolved ? (
            <CheckCircle size={18} className="text-green-400" />
          ) : (
            <div className="w-[18px] h-[18px] rounded-full border border-gray-600" />
          )}

          {/* Title and tags */}
          <div>
            <h3 className="text-white font-medium hover:text-yellow-400 transition">
              {problem.title}
            </h3>
            <div className="flex gap-2 mt-1">
              {problem.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm">{problem.solved} solved</span>
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${difficultyColors[problem.difficulty]}`}
          >
            {problem.difficulty}
          </span>
        </div>
      </div>
    </Link>
  );
}