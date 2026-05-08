"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle, Code2, Trophy, Target } from "lucide-react";
import Link from "next/link";

const difficultyColors = {
  Easy: "text-green-400 bg-green-900",
  Medium: "text-yellow-400 bg-yellow-900",
  Hard: "text-red-400 bg-red-900",
};

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [totalProblems, setTotalProblems] = useState({ Easy: 0, Medium: 0, Hard: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    fetchData();
  }, [authLoading]);

  const fetchData = async () => {
    try {
      const [solvedRes, allRes] = await Promise.all([
        api.get("/problems/solved"),
        api.get("/problems"),
      ]);

      setSolvedProblems(solvedRes.data.solvedProblems);

      const all = allRes.data.problems;
      setTotalProblems({
        Easy: all.filter((p) => p.difficulty === "Easy").length,
        Medium: all.filter((p) => p.difficulty === "Medium").length,
        Hard: all.filter((p) => p.difficulty === "Hard").length,
      });
    } catch {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-gray-950 items-center justify-center">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    );
  }

  const easyCount = solvedProblems.filter((p) => p.difficulty === "Easy").length;
  const mediumCount = solvedProblems.filter((p) => p.difficulty === "Medium").length;
  const hardCount = solvedProblems.filter((p) => p.difficulty === "Hard").length;

  const getProgressWidth = (solved, total) => {
    if (total === 0) return 0;
    return Math.round((solved / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Toaster position="top-right" />
      <Navbar user={user} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left — User Info */}
          <div className="space-y-6">
            {/* Avatar Card */}
            <div className="bg-gray-900 rounded-2xl p-6 text-center">
              <div className="bg-yellow-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-black text-3xl font-bold">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-white text-xl font-bold">{user?.username}</h2>
              <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
              {user?.role === "admin" && (
                <span className="inline-block mt-2 text-xs bg-yellow-900 text-yellow-400 px-3 py-1 rounded-full">
                  Admin
                </span>
              )}
            </div>

            {/* Progress Stats */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Target size={18} className="text-yellow-400" />
                Progress
              </h3>

              {/* Total solved circle */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <svg className="w-24 h-24 -rotate-90">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="#374151" strokeWidth="8" />
                    <circle
                      cx="48" cy="48" r="40" fill="none"
                      stroke="#EAB308"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - getProgressWidth(solvedProblems.length, totalProblems.Easy + totalProblems.Medium + totalProblems.Hard) / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-white text-xl font-bold">{solvedProblems.length}</span>
                    <span className="text-gray-400 text-xs">solved</span>
                  </div>
                </div>
              </div>

              {/* Progress bars */}
              <div className="space-y-3">
                {/* Easy */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-green-400 text-sm">Easy</span>
                    <span className="text-gray-400 text-sm">{easyCount}/{totalProblems.Easy}</span>
                  </div>
                  <div className="bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${getProgressWidth(easyCount, totalProblems.Easy)}%` }}
                    />
                  </div>
                </div>

                {/* Medium */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-yellow-400 text-sm">Medium</span>
                    <span className="text-gray-400 text-sm">{mediumCount}/{totalProblems.Medium}</span>
                  </div>
                  <div className="bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all"
                      style={{ width: `${getProgressWidth(mediumCount, totalProblems.Medium)}%` }}
                    />
                  </div>
                </div>

                {/* Hard */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-red-400 text-sm">Hard</span>
                    <span className="text-gray-400 text-sm">{hardCount}/{totalProblems.Hard}</span>
                  </div>
                  <div className="bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all"
                      style={{ width: `${getProgressWidth(hardCount, totalProblems.Hard)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Solved Problems */}
          <div className="md:col-span-2">
            <div className="bg-gray-900 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <CheckCircle size={18} className="text-green-400" />
                Solved Problems ({solvedProblems.length})
              </h3>

              {loading ? (
                <p className="text-gray-400 text-sm">Loading...</p>
              ) : solvedProblems.length === 0 ? (
                <div className="text-center py-8">
                  <Code2 size={40} className="text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No problems solved yet!</p>
                  <Link
                    href="/problems"
                    className="inline-block mt-3 text-yellow-400 hover:underline text-sm"
                  >
                    Start solving →
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {solvedProblems.map((problem) => (
                    <Link
                      key={problem._id}
                      href={`/problems/${problem._id}`}
                      className="flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle size={16} className="text-green-400" />
                        <span className="text-white text-sm font-medium">
                          {problem.title}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[problem.difficulty]}`}>
                        {problem.difficulty}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
