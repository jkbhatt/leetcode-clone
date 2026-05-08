import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">
          LeetCode <span className="text-yellow-400">Clone</span>
        </h1>
        <p className="text-gray-400 text-xl mb-10">
          Practice coding problems and improve your skills!
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-lg transition"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}