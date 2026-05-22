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
      <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-900 hover:bg-gray-800 rounded-xl transition cursor-pointer border border-gray-800 hover:border-gray-700">
        {/* Left side */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          {/* Problem number */}
          <span className="text-gray-500 text-sm w-5 sm:w-8 shrink-0">{index + 1}</span>

          {/* Solved indicator */}
          {isSolved ? (
            <CheckCircle size={16} className="text-green-400 shrink-0" />
          ) : (
            <div className="w-4 h-4 sm:w-[18px] sm:h-[18px] rounded-full border border-gray-600 shrink-0" />
          )}

          {/* Title and tags */}
          <div className="min-w-0">
            <h3 className="text-white text-sm sm:text-base font-medium hover:text-yellow-400 transition truncate">
              {problem.title}
            </h3>
            <div className="flex gap-1 sm:gap-2 mt-0.5 sm:mt-1 flex-wrap">
              {problem.tags?.slice(0, 2).map((tag) => (
                <span key={tag} className="text-xs text-gray-400 bg-gray-800 px-1.5 sm:px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 ml-2">
          <span className="text-gray-500 text-xs sm:text-sm hidden sm:block">{problem.solved} solved</span>
          <span className={`text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium ${difficultyColors[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
        </div>
      </div>
    </Link>
  );
}
