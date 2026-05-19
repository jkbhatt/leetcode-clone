"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Code2, LogOut, User, Shield, Trophy, Bell, X, Award } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// ✅ All achievements definition (shared across app)
export const ACHIEVEMENTS = [
  { id: "first_solve", label: "First Blood", desc: "Solved your first problem", icon: "🎯", condition: (s) => s.total >= 1 },
  { id: "easy_5", label: "Easy Rider", desc: "Solved 5 easy problems", icon: "⚡", condition: (s) => s.easy >= 5 },
  { id: "easy_2", label: "Warming Up", desc: "Solved 2 easy problems", icon: "🔥", condition: (s) => s.easy >= 2 },
  { id: "medium_1", label: "Rising Star", desc: "Solved a medium problem", icon: "⭐", condition: (s) => s.medium >= 1 },
  { id: "medium_3", label: "Problem Crusher", desc: "Solved 3 medium problems", icon: "💪", condition: (s) => s.medium >= 3 },
  { id: "hard_1", label: "Hard Mode", desc: "Solved a hard problem", icon: "🔥", condition: (s) => s.hard >= 1 },
  { id: "total_5", label: "Grinder", desc: "Solved 5 problems total", icon: "🏆", condition: (s) => s.total >= 5 },
  { id: "total_10", label: "LeetCode Legend", desc: "Solved 10 problems total", icon: "👑", condition: (s) => s.total >= 10 },
];

export default function Navbar({ user, solvedStats }) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

  // Calculate unlocked achievements and new ones
  useEffect(() => {
    if (!solvedStats) return;

    const stats = {
      total: solvedStats.total || 0,
      easy: solvedStats.easy || 0,
      medium: solvedStats.medium || 0,
      hard: solvedStats.hard || 0,
    };

    const unlocked = ACHIEVEMENTS.filter((a) => a.condition(stats));
    const seenKey = `seen_achievements_${user?._id}`;
    const seen = JSON.parse(localStorage.getItem(seenKey) || "[]");
    const newOnes = unlocked.filter((a) => !seen.includes(a.id));

    setNotifications(unlocked.map((a) => ({
      ...a,
      isNew: newOnes.some((n) => n.id === a.id),
    })));

    setUnreadCount(newOnes.length);

    // Show toast for newly unlocked achievements
    newOnes.forEach((achievement) => {
      setTimeout(() => {
        toast(`${achievement.icon} Achievement Unlocked: ${achievement.label}!`, {
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #ca8a04",
          },
          duration: 4000,
        });
      }, 500);
    });
  }, [solvedStats, user]);

  const markAllRead = () => {
    if (!user?._id) return;
    const seenKey = `seen_achievements_${user._id}`;
    const seen = notifications.map((n) => n.id);
    localStorage.setItem(seenKey, JSON.stringify(seen));
    setUnreadCount(0);
    setNotifications(notifications.map((n) => ({ ...n, isNew: false })));
  };

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      toast.success("Logged out!");
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/problems" className="flex items-center gap-2">
          <Code2 size={24} className="text-yellow-400" />
          <span className="text-white font-bold text-xl">LeetCode Clone</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          <Link href="/problems" className="text-gray-400 hover:text-white transition text-sm font-medium">
            Problems
          </Link>

          {user?.role === "admin" && (
            <Link href="/admin" className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 transition text-sm font-medium">
              <Shield size={16} />
              Admin
            </Link>
          )}

          <Link href="/profile" className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm font-medium">
            <User size={16} />
            {user?.username}
          </Link>

          <Link href="/leaderboard" className="flex items-center gap-1 text-gray-400 hover:text-white transition text-sm font-medium">
            <Trophy size={16} />
            Leaderboard
          </Link>

          {/* ✅ Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) markAllRead(); }}
              className="relative text-gray-400 hover:text-white transition"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-yellow-500 text-black text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Panel */}
            {showNotifications && (
              <div className="absolute right-0 top-8 w-72 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-yellow-400" />
                    <span className="text-white text-sm font-semibold">Achievements</span>
                  </div>
                  <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-white transition">
                    <X size={14} />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8">
                      <Trophy size={28} className="text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No achievements yet</p>
                      <p className="text-gray-600 text-xs mt-1">Solve problems to unlock!</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-800">
                      {notifications.map((notif) => (
                        <div key={notif.id} className={`flex items-center gap-3 px-4 py-3 ${notif.isNew ? "bg-yellow-500/5" : ""}`}>
                          <span className="text-xl">{notif.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-white text-sm font-medium">{notif.label}</p>
                              {notif.isNew && (
                                <span className="bg-yellow-500 text-black text-xs px-1.5 py-0.5 rounded-full font-bold">NEW</span>
                              )}
                            </div>
                            <p className="text-gray-400 text-xs">{notif.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="px-4 py-3 border-t border-gray-700">
                  <Link
                    href="/profile"
                    onClick={() => setShowNotifications(false)}
                    className="text-yellow-400 hover:text-yellow-300 text-xs transition"
                  >
                    View all achievements on profile →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition text-sm font-medium"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
