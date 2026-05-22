"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import ProblemCard from "@/components/ProblemCard";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { Search } from "lucide-react";

export default function ProblemsPage() {
  const { user, loading: authLoading } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (authLoading) return;
    fetchProblems(currentPage);
    fetchSolvedProblems();
  }, [authLoading, difficulty, currentPage]);

  const fetchProblems = async (page = 1) => {
    try {
      setLoading(true);
      let url = `/problems?page=${page}&limit=10`;
      if (difficulty !== "All") url += `&difficulty=${difficulty}`;
      if (search) url += `&search=${search}`;
      const res = await api.get(url);
      setProblems(res.data.problems);
      setPagination(res.data.pagination);
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
      console.log("Failed to fetch solved problems");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProblems(1);
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-gray-950 items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Toaster position="top-right" />
      <Navbar user={user} />

      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-5 sm:py-8">

        {/* Header */}
        <div className="mb-5 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Problems</h2>
          <p className="text-gray-400 text-sm">
            {pagination?.totalProblems || problems.length} problems available
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <div className="flex items-center gap-2 bg-gray-900 rounded-lg px-3 sm:px-4 py-2.5 flex-1">
              <Search size={15} className="text-gray-400 shrink-0" />
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
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 sm:px-4 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap"
            >
              Search
            </button>
          </form>

          {/* Difficulty Filter */}
          <select
            value={difficulty}
            onChange={(e) => { setDifficulty(e.target.value); setCurrentPage(1); }}
            className="bg-gray-900 text-white rounded-lg px-3 sm:px-4 py-2.5 outline-none text-sm w-full sm:w-auto"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Stats */}
        <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6">
          {["Easy", "Medium", "Hard"].map((diff) => {
            const count = problems.filter((p) => p.difficulty === diff).length;
            const colors = { Easy: "text-green-400", Medium: "text-yellow-400", Hard: "text-red-400" };
            return (
              <div key={diff} className="bg-gray-900 rounded-xl px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-none">
                <span className={`font-bold text-sm sm:text-base ${colors[diff]}`}>{count}</span>
                <span className="text-gray-400 text-xs sm:text-sm">{diff}</span>
              </div>
            );
          })}
        </div>

        {/* Problems */}
        {loading ? (
          <div className="flex items-center justify-center mt-20">
            <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : problems.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-gray-400 text-lg">No problems found!</p>
          </div>
        ) : (
          <>
            <div className="space-y-2 sm:space-y-3">
              {problems.map((problem, index) => (
                <div key={problem._id} className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0">
                    <ProblemCard
                      problem={problem}
                      index={index}
                      isSolved={solvedProblems.includes(problem._id)}
                    />
                  </div>
                  {user?.role === "admin" && (
                    <Link
                      href={`/admin/edit/${problem._id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm shrink-0"
                    >
                      Edit
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && (
              <div className="flex items-center justify-center gap-2 sm:gap-4 mt-6 sm:mt-8 flex-wrap">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-3 sm:px-4 py-2 bg-gray-800 text-white rounded-lg text-sm disabled:opacity-40 hover:bg-gray-700 transition"
                >
                  ← Prev
                </button>
                <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-sm font-medium transition ${
                        page === pagination.currentPage
                          ? "bg-yellow-500 text-black"
                          : "bg-gray-800 text-white hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-3 sm:px-4 py-2 bg-gray-800 text-white rounded-lg text-sm disabled:opacity-40 hover:bg-gray-700 transition"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
