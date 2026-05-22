"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()  // ← THIS LINE IS CRITICAL
    setLoading(true);
    try {
      await api.post("/auth/login", form);
      toast.success("Login successful!");
      setTimeout(() => router.push("/problems"), 1500);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-8">
    
    <Toaster position="top-right" />

    <div className="w-full max-w-md">
      
      {/* Logo / Heading */}
      <div className="text-center mb-8">
        
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          LeetCode Clone
        </h1>

        <p className="text-gray-400 text-sm sm:text-base">
          Sign in to continue your coding journey
        </p>
      </div>

      {/* Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3.5 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 text-sm sm:text-base"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3.5 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 text-sm sm:text-base"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 active:scale-[0.99] text-black font-semibold py-3.5 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Don&apos;t have an account?{" "}
            
            <Link
              href="/register"
              className="text-yellow-400 hover:text-yellow-300 hover:underline font-medium transition"
            >
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom Text */}
      <p className="text-center text-gray-500 text-xs sm:text-sm mt-6 px-4">
        Practice coding problems, improve your DSA skills, and climb the leaderboard.
      </p>
    </div>
  </div>
);