"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Code2, LogOut, User, Shield } from "lucide-react";
import { Code2, LogOut, User, Shield, Trophy } from "lucide-react";

export default function Navbar({ user }) {
  const router = useRouter();

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
          <Link
            href="/problems"
            className="text-gray-400 hover:text-white transition text-sm font-medium"
          >
            Problems
          </Link>

          {/* Admin link - only for admins */}
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 transition text-sm font-medium"
            >
              <Shield size={16} />
              Admin
            </Link>
          )}

          {/* Profile */}
          <Link
            href="/profile"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm font-medium"
          >
            <User size={16} />
            {user?.username}
          </Link>

          <Link
            href="/leaderboard" 
            className="flex items-center gap-1 text-gray-400 hover:text-white transition text-sm font-medium">
            <Trophy size={16} />Leaderboard
          </Link>

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