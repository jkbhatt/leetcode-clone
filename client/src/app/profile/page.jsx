"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle, Code2, Trophy, User } from "lucide-react";
import Link from "next/link";

const difficultyColors = {
  Easy: "text-green-400 bg-green-900",
  Medium: "text-yellow-400 bg-yellow-900",
  Hard: "text-red-400 bg-red-900",
};

export default function ProfilePage() {
  // ✅ ALL hooks at top
  const { user, loading: authLoading } = useAuth();
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    fetchSolvedProblems();
  }, [authLoading]);

  const fetchSolvedProblems = async () => {
    try {
      const res = await api.get("/problems/solved");
      setSolvedProblems(res.data.solvedProblems);
    } catch {
      toast.error("Failed to fetch solved problems");
    } finally {
      setLoading(false);
    }
  };

  // ✅ conditions after all hooks
  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-gray-950 items-center justify-center">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    );
  }

  // Count by difficulty
  const easyCount = solvedProblems.filter((p) => p.difficulty === "Easy").length;
  const mediumCount = solvedProblems.filter((p) => p.difficulty === "Medium").length;
  const hardCount = solvedProblems.filter((p) => p.difficulty === "Hard").length;

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

            {/* Stats Card */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Trophy size={18} className="text-yellow-400" />
                Progress
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-green-400 text-sm">Easy</span>
                  <span className="text-white font-bold">{easyCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 text-sm">Medium</span>
                  <span className="text-white font-bold">{mediumCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-red-400 text-sm">Hard</span>
                  <span className="text-white font-bold">{hardCount}</span>
                </div>
                <div className="border-t border-gray-800 pt-3 flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Total Solved</span>
                  <span className="text-white font-bold">{solvedProblems.length}</span>
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
