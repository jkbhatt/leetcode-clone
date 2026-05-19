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

  // Pagination state
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {

    if (authLoading) return;

    fetchProblems(currentPage);

    fetchSolvedProblems();

  }, [authLoading, difficulty, currentPage]);

  // Fetch problems
  const fetchProblems = async (page = 1) => {

    try {

      setLoading(true);

      let url = `/problems?page=${page}&limit=10`;

      if (difficulty !== "All") {
        url += `&difficulty=${difficulty}`;
      }

      if (search) {
        url += `&search=${search}`;
      }

      const res = await api.get(url);

      setProblems(res.data.problems);

      // Save pagination info
      setPagination(res.data.pagination);

    } catch {

      toast.error("Failed to fetch problems");

    } finally {

      setLoading(false);

    }
  };

  // Fetch solved problems
  const fetchSolvedProblems = async () => {

    try {

      const res = await api.get("/problems/solved");

      setSolvedProblems(
        res.data.solvedProblems.map((p) => p._id)
      );

    } catch {

      console.log("Failed to fetch solved problems");

    }
  };

  // Handle search
  const handleSearch = (e) => {

    e.preventDefault();

    setCurrentPage(1);

    fetchProblems(1);
  };

  if (authLoading) {

    return (

      <div className="flex min-h-screen bg-gray-950 items-center justify-center">

        <p className="text-gray-400 text-lg">
          Loading...
        </p>

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

          <h2 className="text-2xl font-bold text-white mb-1">
            Problems
          </h2>

          <p className="text-gray-400 text-sm">
            {pagination?.totalProblems || problems.length} problems available
          </p>

        </div>

        {/* Search + Filter */}
        <div className="flex gap-4 mb-6">

          <form
            onSubmit={handleSearch}
            className="flex-1 flex gap-2"
          >

            <div className="flex items-center gap-2 bg-gray-900 rounded-lg px-4 py-2.5 flex-1">

              <Search
                size={16}
                className="text-gray-400"
              />

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
            onChange={(e) => {

              setDifficulty(e.target.value);

              setCurrentPage(1);
            }}
            className="bg-gray-900 text-white rounded-lg px-4 py-2.5 outline-none text-sm"
          >

            <option value="All">
              All Difficulties
            </option>

            <option value="Easy">
              Easy
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="Hard">
              Hard
            </option>

          </select>

        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-6">

          {["Easy", "Medium", "Hard"].map((diff) => {

            const count =
              problems.filter(
                (p) => p.difficulty === diff
              ).length;

            const colors = {
              Easy: "text-green-400",
              Medium: "text-yellow-400",
              Hard: "text-red-400",
            };

            return (

              <div
                key={diff}
                className="bg-gray-900 rounded-xl px-4 py-3 flex items-center gap-2"
              >

                <span className={`font-bold ${colors[diff]}`}>
                  {count}
                </span>

                <span className="text-gray-400 text-sm">
                  {diff}
                </span>

              </div>
            );
          })}

        </div>

        {/* Problems */}
        {loading ? (

          <div className="text-gray-400 text-center mt-20">
            Loading problems...
          </div>

        ) : problems.length === 0 ? (

          <div className="text-center mt-20">

            <p className="text-gray-400 text-lg">
              No problems found!
            </p>

          </div>

        ) : (

          <>
            <div className="space-y-3">

              {problems.map((problem, index) => (

                <div
                  key={problem._id}
                  className="flex items-center gap-3"
                >

                  <div className="flex-1">

                    <ProblemCard
                      problem={problem}
                      index={index}
                      isSolved={solvedProblems.includes(problem._id)}
                    />

                  </div>

                  {user?.role === "admin" && (

                    <Link
                      href={`/admin/edit/${problem._id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Edit
                    </Link>

                  )}

                </div>

              ))}

            </div>

            {/* Pagination */}
            {pagination && (

              <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">

                {/* Previous */}
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm disabled:opacity-40 hover:bg-gray-700 transition"
                >
                  ← Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-2 flex-wrap justify-center">

                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (

                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                        page === pagination.currentPage
                          ? "bg-yellow-500 text-black"
                          : "bg-gray-800 text-white hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>

                  ))}

                </div>

                {/* Next */}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm disabled:opacity-40 hover:bg-gray-700 transition"
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