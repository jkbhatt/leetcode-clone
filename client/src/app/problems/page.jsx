"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import ProblemCard from "@/components/ProblemCard";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { Search, Filter } from "lucide-react";

export default function ProblemsPage() {
  // ✅ ALL hooks at top
  const { user, loading: authLoading } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [solvedProblems, setSolvedProblems] = useState([]);

  useEffect(() => {
    if (authLoading) return;
    fetchProblems();
    fetchSolvedProblems();
  }, [authLoading, difficulty]);

  const fetchProblems = async () => {
    try {
      let url = "/problems";
      const params = [];
      if (difficulty !== "All") params.push(`difficulty=${difficulty}`);
      if (search) params.push(`search=${search}`);
      if (params.length > 0) url += `?${params.join("&")}`;

      const res = await api.get(url);
      setProblems(res.data.problems);
    } catch {
      toast.error("Failed to fetch problems");
    } finally {
      setLoading(false);
    }
  };

  const fetchSolvedProblems = async () => {
    try {
      const res = await api.get("/problems/solved");
      setSolvedProblems(res.data.solvedProblems.map((p) => p._id));
    } catch {
      // silently fail
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProblems();
  };

  // ✅ conditions after all hooks
  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-gray-950 items-center justify-center">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Toaster position="top-right" />
      <Navbar user={user} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-1">Problems</h2>
          <p className="text-gray-400 text-sm">
            {problems.length} problems available
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="flex items-center gap-2 bg-gray-900 rounded-lg px-4 py-2.5 flex-1">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search problems..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-white outline-none w-full text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2.5 rounded-lg text-sm font-medium transition"
            >
              Search
            </button>
          </form>

          {/* Difficulty Filter */}
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-gray-900 text-white rounded-lg px-4 py-2.5 outline-none text-sm"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Stats Bar */}
        <div className="flex gap-4 mb-6">
          {["Easy", "Medium", "Hard"].map((diff) => {
            const count = problems.filter((p) => p.difficulty === diff).length;
            const colors = {
              Easy: "text-green-400",
              Medium: "text-yellow-400",
              Hard: "text-red-400",
            };
            return (
              <div key={diff} className="bg-gray-900 rounded-xl px-4 py-3 flex items-center gap-2">
                <span className={`font-bold ${colors[diff]}`}>{count}</span>
                <span className="text-gray-400 text-sm">{diff}</span>
              </div>
            );
          })}
        </div>

        {/* Problems List */}
        {loading ? (
          <div className="text-gray-400 text-center mt-20">
            Loading problems...
          </div>
        ) : problems.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-gray-400 text-lg">No problems found!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {problems.map((problem, index) => (
              <ProblemCard
                key={problem._id}
                problem={problem}
                index={index}
                isSolved={solvedProblems.includes(problem._id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
