"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  CheckCircle, Code2, Trophy, Target, Zap, Award,
  TrendingUp, Calendar, Star, ArrowRight
} from "lucide-react";
import Link from "next/link";

const difficultyColors = {
  Easy: "text-green-400 bg-green-900/40 border border-green-800",
  Medium: "text-yellow-400 bg-yellow-900/40 border border-yellow-800",
  Hard: "text-red-400 bg-red-900/40 border border-red-800",
};

const difficultyBar = {
  Easy: "bg-green-500",
  Medium: "bg-yellow-500",
  Hard: "bg-red-500",
};

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [totalProblems, setTotalProblems] = useState({ Easy: 0, Medium: 0, Hard: 0 });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

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

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen bg-gray-950 items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const easyCount = solvedProblems.filter((p) => p.difficulty === "Easy").length;
  const mediumCount = solvedProblems.filter((p) => p.difficulty === "Medium").length;
  const hardCount = solvedProblems.filter((p) => p.difficulty === "Hard").length;
  const totalSolved = solvedProblems.length;
  const totalAll = totalProblems.Easy + totalProblems.Medium + totalProblems.Hard;

  const getProgressWidth = (solved, total) => {
    if (total === 0) return 0;
    return Math.round((solved / total) * 100);
  };

  const overallProgress = getProgressWidth(totalSolved, totalAll);

  // Score calculation
  const score = easyCount * 10 + mediumCount * 25 + hardCount * 50;

  // Rank based on score
  const getRank = (score) => {
    if (score >= 500) return { label: "Legend", color: "text-yellow-400", icon: "🏆" };
    if (score >= 200) return { label: "Expert", color: "text-purple-400", icon: "⚡" };
    if (score >= 100) return { label: "Advanced", color: "text-blue-400", icon: "🔥" };
    if (score >= 50) return { label: "Intermediate", color: "text-green-400", icon: "⭐" };
    return { label: "Beginner", color: "text-gray-400", icon: "🌱" };
  };

  const rank = getRank(score);

  const filteredProblems = activeFilter === "All"
    ? solvedProblems
    : solvedProblems.filter((p) => p.difficulty === activeFilter);

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently";

  return (
    <div className="min-h-screen bg-gray-950">
      <Toaster position="top-right" />
      <Navbar user={user} />

      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* ── Top Banner ── */}
        <div className="relative bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 rounded-3xl p-8 mb-6 overflow-hidden border border-gray-800">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 right-24 w-32 h-32 bg-yellow-500/5 rounded-full translate-y-1/2" />

          <div className="relative flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <span className="text-black text-4xl font-black">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gray-900 rounded-lg px-2 py-0.5 border border-gray-700 text-xs">
                <span>{rank.icon}</span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-white text-2xl font-bold">{user?.username}</h1>
                {user?.role === "admin" && (
                  <span className="text-xs bg-yellow-900/50 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-800">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-3">{user?.email}</p>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-semibold ${rank.color}`}>
                  {rank.icon} {rank.label}
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400 text-sm flex items-center gap-1">
                  <Calendar size={13} />
                  Joined {joinDate}
                </span>
              </div>
            </div>

            {/* Score */}
            <div className="text-center hidden md:block">
              <div className="text-3xl font-black text-yellow-400">{score}</div>
              <div className="text-gray-400 text-xs mt-1">Total Score</div>
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Solved", value: totalSolved, icon: <CheckCircle size={18} />, color: "text-green-400", bg: "bg-green-900/20 border-green-800" },
            { label: "Easy", value: easyCount, icon: <Zap size={18} />, color: "text-green-400", bg: "bg-green-900/20 border-green-800" },
            { label: "Medium", value: mediumCount, icon: <Target size={18} />, color: "text-yellow-400", bg: "bg-yellow-900/20 border-yellow-800" },
            { label: "Hard", value: hardCount, icon: <Trophy size={18} />, color: "text-red-400", bg: "bg-red-900/20 border-red-800" },
          ].map(({ label, value, icon, color, bg }) => (
            <div key={label} className={`bg-gray-900 rounded-2xl p-4 border ${bg} flex items-center gap-3`}>
              <div className={`${color} opacity-80`}>{icon}</div>
              <div>
                <div className={`text-2xl font-bold ${color}`}>{value}</div>
                <div className="text-gray-400 text-xs">{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ── Left: Progress ── */}
          <div className="space-y-4">

            {/* Overall Progress */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                <TrendingUp size={16} className="text-yellow-400" />
                Overall Progress
              </h3>

              {/* Circle */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#1f2937" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke="#EAB308"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - overallProgress / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-white text-2xl font-bold">{totalSolved}</span>
                    <span className="text-gray-500 text-xs">/ {totalAll}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-4">
                {[
                  { label: "Easy", solved: easyCount, total: totalProblems.Easy, color: "bg-green-500", textColor: "text-green-400" },
                  { label: "Medium", solved: mediumCount, total: totalProblems.Medium, color: "bg-yellow-500", textColor: "text-yellow-400" },
                  { label: "Hard", solved: hardCount, total: totalProblems.Hard, color: "bg-red-500", textColor: "text-red-400" },
                ].map(({ label, solved, total, color, textColor }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-1.5">
                      <span className={`text-sm font-medium ${textColor}`}>{label}</span>
                      <span className="text-gray-400 text-sm">{solved}/{total}</span>
                    </div>
                    <div className="bg-gray-800 rounded-full h-2">
                      <div
                        className={`${color} h-2 rounded-full transition-all duration-700`}
                        style={{ width: `${getProgressWidth(solved, total)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Award size={16} className="text-yellow-400" />
                Achievements
              </h3>
              <div className="space-y-3">
                {[
                  { label: "First Solve", desc: "Solved your first problem", unlocked: totalSolved >= 1, icon: "🎯" },
                  { label: "Easy Streak", desc: "Solved 2+ easy problems", unlocked: easyCount >= 2, icon: "⚡" },
                  { label: "Problem Crusher", desc: "Solved 5+ problems", unlocked: totalSolved >= 5, icon: "💪" },
                  { label: "Hard Mode", desc: "Solved a hard problem", unlocked: hardCount >= 1, icon: "🔥" },
                ].map(({ label, desc, unlocked, icon }) => (
                  <div key={label} className={`flex items-center gap-3 p-3 rounded-xl ${unlocked ? "bg-yellow-900/20 border border-yellow-800/50" : "bg-gray-800/50 border border-gray-700/50 opacity-50"}`}>
                    <span className="text-xl">{icon}</span>
                    <div>
                      <div className={`text-sm font-medium ${unlocked ? "text-white" : "text-gray-500"}`}>{label}</div>
                      <div className="text-xs text-gray-500">{desc}</div>
                    </div>
                    {unlocked && <CheckCircle size={14} className="text-yellow-400 ml-auto" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Solved Problems ── */}
          <div className="md:col-span-2">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Star size={16} className="text-yellow-400" />
                  Solved Problems
                  <span className="text-gray-500 font-normal text-sm">({totalSolved})</span>
                </h3>

                {/* Filter Tabs */}
                <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
                  {["All", "Easy", "Medium", "Hard"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                        activeFilter === f
                          ? "bg-yellow-500 text-black"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredProblems.length === 0 ? (
                <div className="text-center py-12">
                  <Code2 size={40} className="text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-400 mb-1">
                    {activeFilter === "All" ? "No problems solved yet!" : `No ${activeFilter} problems solved yet!`}
                  </p>
                  <Link
                    href="/problems"
                    className="inline-flex items-center gap-1 mt-3 text-yellow-400 hover:text-yellow-300 text-sm transition"
                  >
                    Start solving <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {filteredProblems.map((problem, i) => (
                    <Link
                      key={problem._id}
                      href={`/problems/${problem._id}`}
                      className="flex items-center justify-between p-3.5 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600 rounded-xl transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-900/50 border border-green-800 rounded-full flex items-center justify-center">
                          <CheckCircle size={12} className="text-green-400" />
                        </div>
                        <div>
                          <span className="text-white text-sm font-medium group-hover:text-yellow-400 transition">
                            {problem.title}
                          </span>
                          {problem.tags?.length > 0 && (
                            <div className="flex gap-1 mt-0.5">
                              {problem.tags.slice(0, 2).map((tag) => (
                                <span key={tag} className="text-xs text-gray-500">{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${difficultyColors[problem.difficulty]}`}>
                          {problem.difficulty}
                        </span>
                        <ArrowRight size={14} className="text-gray-600 group-hover:text-yellow-400 transition" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Footer */}
              {totalSolved < totalAll && (
                <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
                  <span className="text-gray-500 text-sm">{totalAll - totalSolved} problems remaining</span>
                  <Link
                    href="/problems"
                    className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 text-sm transition"
                  >
                    Solve more <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
