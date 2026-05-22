"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { Trophy } from "lucide-react";

export default function LeaderboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    fetchLeaderboard();
  }, [authLoading]);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get("/problems/leaderboard/all");
      setLeaderboard(res.data.leaderboard);
    } catch {
      toast.error("Failed to fetch leaderboard");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-gray-950 items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getRankColor = (rank) => {
    if (rank === 1) return "text-yellow-400";
    if (rank === 2) return "text-gray-300";
    if (rank === 3) return "text-orange-400";
    return "text-gray-500";
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Toaster position="top-right" />
      <Navbar user={user} />

      <main className="max-w-3xl mx-auto px-3 sm:px-4 py-5 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy size={24} className="text-yellow-400" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Leaderboard</h2>
          </div>
          <p className="text-gray-400 text-sm">Top coders ranked by problems solved</p>
        </div>

        {/* Top 3 - hidden on very small screens */}
        {!loading && leaderboard.length >= 3 && (
          <div className="flex items-end justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
            {/* 2nd place */}
            <div className="text-center">
              <div className="bg-gray-700 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-1 sm:mb-2">
                <span className="text-lg sm:text-2xl font-bold text-gray-300">
                  {leaderboard[1]?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-gray-300 font-medium text-xs sm:text-sm truncate max-w-16 sm:max-w-none">{leaderboard[1]?.username}</p>
              <p className="text-gray-400 text-xs">{leaderboard[1]?.solved} solved</p>
              <div className="bg-gray-700 h-12 sm:h-16 w-14 sm:w-20 rounded-t-lg mt-1 sm:mt-2 flex items-center justify-center">
                <span className="text-lg sm:text-2xl">🥈</span>
              </div>
            </div>

            {/* 1st place */}
            <div className="text-center">
              <div className="bg-yellow-500 rounded-full w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-1 sm:mb-2">
                <span className="text-xl sm:text-2xl font-bold text-black">
                  {leaderboard[0]?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-yellow-400 font-bold text-sm truncate max-w-16 sm:max-w-none">{leaderboard[0]?.username}</p>
              <p className="text-gray-400 text-xs">{leaderboard[0]?.solved} solved</p>
              <div className="bg-yellow-600 h-16 sm:h-24 w-14 sm:w-20 rounded-t-lg mt-1 sm:mt-2 flex items-center justify-center">
                <span className="text-lg sm:text-2xl">🥇</span>
              </div>
            </div>

            {/* 3rd place */}
            <div className="text-center">
              <div className="bg-orange-700 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-1 sm:mb-2">
                <span className="text-lg sm:text-2xl font-bold text-orange-200">
                  {leaderboard[2]?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-orange-400 font-medium text-xs sm:text-sm truncate max-w-16 sm:max-w-none">{leaderboard[2]?.username}</p>
              <p className="text-gray-400 text-xs">{leaderboard[2]?.solved} solved</p>
              <div className="bg-orange-700 h-10 sm:h-12 w-14 sm:w-20 rounded-t-lg mt-1 sm:mt-2 flex items-center justify-center">
                <span className="text-lg sm:text-2xl">🥉</span>
              </div>
            </div>
          </div>
        )}

        {/* Full List */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 px-3 sm:px-6 py-3 border-b border-gray-800">
            <span className="text-gray-400 text-xs font-medium col-span-2">Rank</span>
            <span className="text-gray-400 text-xs font-medium col-span-7">User</span>
            <span className="text-gray-400 text-xs font-medium col-span-3 text-right">Solved</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-gray-400 text-center py-10 text-sm">No users yet!</div>
          ) : (
            leaderboard.map((entry) => (
              <div
                key={entry.username}
                className={`grid grid-cols-12 px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-800 hover:bg-gray-800 transition ${
                  entry.username === user?.username ? "bg-gray-800 border-l-2 border-l-yellow-400" : ""
                }`}
              >
                <span className={`font-bold text-base sm:text-lg col-span-2 ${getRankColor(entry.rank)}`}>
                  {getRankIcon(entry.rank)}
                </span>
                <div className="col-span-7 flex items-center gap-2">
                  <div className={`rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 ${
                    entry.rank === 1 ? "bg-yellow-500 text-black" :
                    entry.rank === 2 ? "bg-gray-600 text-white" :
                    entry.rank === 3 ? "bg-orange-700 text-white" :
                    "bg-gray-700 text-gray-300"
                  }`}>
                    {entry.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className={`font-medium text-sm sm:text-base truncate ${entry.username === user?.username ? "text-yellow-400" : "text-white"}`}>
                    {entry.username}
                    {entry.username === user?.username && <span className="text-xs text-gray-400 ml-1 hidden sm:inline">(you)</span>}
                  </span>
                </div>
                <span className="text-white font-bold text-right col-span-3 text-sm sm:text-base">{entry.solved}</span>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
