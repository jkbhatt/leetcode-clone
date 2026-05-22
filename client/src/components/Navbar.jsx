"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Code2, LogOut, User, Shield, Trophy, Bell, X, Award, Sun, Moon, Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";

export const ACHIEVEMENTS = [
  { id: "first_solve", label: "First Blood", desc: "Solved your first problem", icon: "🎯", condition: (s) => s.total >= 1 },
  { id: "easy_2", label: "Warming Up", desc: "Solved 2 easy problems", icon: "🔥", condition: (s) => s.easy >= 2 },
  { id: "easy_5", label: "Easy Rider", desc: "Solved 5 easy problems", icon: "⚡", condition: (s) => s.easy >= 5 },
  { id: "medium_1", label: "Rising Star", desc: "Solved a medium problem", icon: "⭐", condition: (s) => s.medium >= 1 },
  { id: "medium_3", label: "Problem Crusher", desc: "Solved 3 medium problems", icon: "💪", condition: (s) => s.medium >= 3 },
  { id: "hard_1", label: "Hard Mode", desc: "Solved a hard problem", icon: "🔥", condition: (s) => s.hard >= 1 },
  { id: "total_5", label: "Grinder", desc: "Solved 5 problems total", icon: "🏆", condition: (s) => s.total >= 5 },
  { id: "total_10", label: "LeetCode Legend", desc: "Solved 10 problems total", icon: "👑", condition: (s) => s.total >= 10 },
];

export default function Navbar({ user, solvedStats }) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);
  const isDark = theme === "dark";

  useEffect(() => {
    if (!solvedStats) return;
    const stats = { total: solvedStats.total || 0, easy: solvedStats.easy || 0, medium: solvedStats.medium || 0, hard: solvedStats.hard || 0 };
    const unlocked = ACHIEVEMENTS.filter((a) => a.condition(stats));
    const seenKey = `seen_achievements_${user?._id}`;
    const seen = JSON.parse(localStorage.getItem(seenKey) || "[]");
    const newOnes = unlocked.filter((a) => !seen.includes(a.id));
    setNotifications(unlocked.map((a) => ({ ...a, isNew: newOnes.some((n) => n.id === a.id) })));
    setUnreadCount(newOnes.length);
    newOnes.forEach((achievement) => {
      setTimeout(() => {
        toast(`${achievement.icon} Achievement Unlocked: ${achievement.label}!`, {
          style: { background: "#1f2937", color: "#fff", border: "1px solid #ca8a04" },
          duration: 4000,
        });
      }, 500);
    });
  }, [solvedStats, user]);

  const markAllRead = () => {
    if (!user?._id) return;
    localStorage.setItem(`seen_achievements_${user._id}`, JSON.stringify(notifications.map((n) => n.id)));
    setUnreadCount(0);
    setNotifications(notifications.map((n) => ({ ...n, isNew: false })));
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
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

  const navBg = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const textColor = isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900";
  const mobileBg = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";

  return (
    <>
      <nav className={`border-b px-4 md:px-6 py-3 md:py-4 ${navBg}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/problems" className="flex items-center gap-2">
            <Code2 size={22} className="text-yellow-400" />
            <span className={`font-bold text-lg md:text-xl ${isDark ? "text-white" : "text-gray-900"}`}>
              LeetCode Clone
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/problems" className={`transition text-sm font-medium ${textColor}`}>Problems</Link>
            {user?.role === "admin" && (
              <Link href="/admin" className="flex items-center gap-1 text-yellow-500 hover:text-yellow-400 transition text-sm font-medium">
                <Shield size={16} /> Admin
              </Link>
            )}
            <Link href="/profile" className={`flex items-center gap-2 transition text-sm font-medium ${textColor}`}>
              <User size={16} /> {user?.username}
            </Link>
            <Link href="/leaderboard" className={`flex items-center gap-1 transition text-sm font-medium ${textColor}`}>
              <Trophy size={16} /> Leaderboard
            </Link>

            {/* Theme Toggle */}
            <button onClick={toggleTheme} className={`p-2 rounded-lg border transition ${isDark ? "bg-gray-800 border-gray-700 text-yellow-400 hover:bg-gray-700" : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"}`}>
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) markAllRead(); }} className={`relative transition ${textColor}`}>
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-yellow-500 text-black text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">{unreadCount}</span>
                )}
              </button>
              {showNotifications && (
                <div className={`absolute right-0 top-8 w-72 border rounded-2xl shadow-2xl z-50 overflow-hidden ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
                  <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-yellow-400" />
                      <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Achievements</span>
                    </div>
                    <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-white transition"><X size={14} /></button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8">
                        <Trophy size={28} className="text-gray-400 mx-auto mb-2" />
                        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>No achievements yet</p>
                      </div>
                    ) : (
                      <div className={`divide-y ${isDark ? "divide-gray-800" : "divide-gray-100"}`}>
                        {notifications.map((notif) => (
                          <div key={notif.id} className={`flex items-center gap-3 px-4 py-3 ${notif.isNew ? "bg-yellow-500/5" : ""}`}>
                            <span className="text-xl">{notif.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{notif.label}</p>
                                {notif.isNew && <span className="bg-yellow-500 text-black text-xs px-1.5 py-0.5 rounded-full font-bold">NEW</span>}
                              </div>
                              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{notif.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={`px-4 py-3 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                    <Link href="/profile" onClick={() => setShowNotifications(false)} className="text-yellow-500 hover:text-yellow-400 text-xs transition">
                      View all achievements →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <button onClick={handleLogout} className={`flex items-center gap-2 transition text-sm font-medium ${isDark ? "text-gray-400 hover:text-red-400" : "text-gray-600 hover:text-red-500"}`}>
              <LogOut size={16} /> Logout
            </button>
          </div>

          {/* Mobile Right Side */}
          <div className="flex md:hidden items-center gap-3">
            <button onClick={toggleTheme} className={`p-1.5 rounded-lg ${isDark ? "text-yellow-400" : "text-gray-600"}`}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="relative">
              <button onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) markAllRead(); }} className={`relative ${textColor}`}>
                <Bell size={20} />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">{unreadCount}</span>}
              </button>
            </div>
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className={`p-1.5 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className={`md:hidden border-b ${mobileBg} px-4 py-4 space-y-1 z-40`}>
          <Link href="/problems" onClick={() => setShowMobileMenu(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${textColor}`}>
            <Code2 size={18} /> Problems
          </Link>
          <Link href="/profile" onClick={() => setShowMobileMenu(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${textColor}`}>
            <User size={18} /> {user?.username}
          </Link>
          <Link href="/leaderboard" onClick={() => setShowMobileMenu(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${textColor}`}>
            <Trophy size={18} /> Leaderboard
          </Link>
          {user?.role === "admin" && (
            <Link href="/admin" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-yellow-500">
              <Shield size={18} /> Admin
            </Link>
          )}
          <button onClick={() => { handleLogout(); setShowMobileMenu(false); }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 w-full">
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </>
  );
}
