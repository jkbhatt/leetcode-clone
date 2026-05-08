"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { Trophy, Medal } from "lucide-react";

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
        <p className="text-gray-400 text-lg">Loading...</p>
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

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy size={28} className="text-yellow-400" />
            <h2 className="text-3xl font-bold text-white">Leaderboard</h2>
          </div>
          <p className="text-gray-400">Top coders ranked by problems solved</p>
        </div>

        {/* Top 3 */}
        {!loading && leaderboard.length >= 3 && (
          <div className="flex items-end justify-center gap-4 mb-8">
            {/* 2nd place */}
            <div className="text-center">
              <div className="bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl font-bold text-gray-300">
                  {leaderboard[1]?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-gray-300 font-medium text-sm">{leaderboard[1]?.username}</p>
              <p className="text-gray-400 text-xs">{leaderboard[1]?.solved} solved</p>
              <div className="bg-gray-700 h-16 w-20 rounded-t-lg mt-2 flex items-center justify-center">
                <span className="text-2xl">🥈</span>
              </div>
            </div>

            {/* 1st place */}
            <div className="text-center">
              <div className="bg-yellow-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl font-bold text-black">
                  {leaderboard[0]?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-yellow-400 font-bold">{leaderboard[0]?.username}</p>
              <p className="text-gray-400 text-xs">{leaderboard[0]?.solved} solved</p>
              <div className="bg-yellow-600 h-24 w-20 rounded-t-lg mt-2 flex items-center justify-center">
                <span className="text-2xl">🥇</span>
              </div>
            </div>

            {/* 3rd place */}
            <div className="text-center">
              <div className="bg-orange-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl font-bold text-orange-200">
                  {leaderboard[2]?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-orange-400 font-medium text-sm">{leaderboard[2]?.username}</p>
              <p className="text-gray-400 text-xs">{leaderboard[2]?.solved} solved</p>
              <div className="bg-orange-700 h-12 w-20 rounded-t-lg mt-2 flex items-center justify-center">
                <span className="text-2xl">🥉</span>
              </div>
            </div>
          </div>
        )}

        {/* Full List */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-4 px-6 py-3 border-b border-gray-800">
            <span className="text-gray-400 text-sm font-medium">Rank</span>
            <span className="text-gray-400 text-sm font-medium col-span-2">User</span>
            <span className="text-gray-400 text-sm font-medium text-right">Solved</span>
          </div>

          {loading ? (
            <div className="text-gray-400 text-center py-10">Loading...</div>
          ) : leaderboard.length === 0 ? (
            <div className="text-gray-400 text-center py-10">No users yet!</div>
          ) : (
            leaderboard.map((entry) => (
              <div
                key={entry.username}
                className={`grid grid-cols-4 px-6 py-4 border-b border-gray-800 hover:bg-gray-800 transition ${
                  entry.username === user?.username ? "bg-gray-800 border-l-2 border-l-yellow-400" : ""
                }`}
              >
                {/* Rank */}
                <span className={`font-bold text-lg ${getRankColor(entry.rank)}`}>
                  {getRankIcon(entry.rank)}
                </span>

                {/* Username */}
                <div className="col-span-2 flex items-center gap-3">
                  <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold ${
                    entry.rank === 1 ? "bg-yellow-500 text-black" :
                    entry.rank === 2 ? "bg-gray-600 text-white" :
                    entry.rank === 3 ? "bg-orange-700 text-white" :
                    "bg-gray-700 text-gray-300"
                  }`}>
                    {entry.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className={`font-medium ${
                    entry.username === user?.username ? "text-yellow-400" : "text-white"
                  }`}>
                    {entry.username}
                    {entry.username === user?.username && (
                      <span className="text-xs text-gray-400 ml-2">(you)</span>
                    )}
                  </span>
                </div>

                {/* Solved count */}
                <span className="text-white font-bold text-right">{entry.solved}</span>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
