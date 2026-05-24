import Link from "next/link";
import { Code2, Trophy, Zap, MessageSquare, Lightbulb, Timer, Award, ChevronRight, CheckCircle } from "lucide-react";

const features = [
  {
    icon: <Code2 size={24} className="text-yellow-400" />,
    title: "Code Editor",
    desc: "Full-featured editor with syntax highlighting for JavaScript, Python, Java and C++.",
  },
  {
    icon: <Zap size={24} className="text-green-400" />,
    title: "Instant Feedback",
    desc: "Run your code against test cases and get results in seconds.",
  },
  {
    icon: <Lightbulb size={24} className="text-blue-400" />,
    title: "AI Hints",
    desc: "Stuck? Get intelligent hints powered by AI without spoiling the solution.",
  },
  {
    icon: <Trophy size={24} className="text-orange-400" />,
    title: "Leaderboard",
    desc: "Compete with others and climb the ranks as you solve more problems.",
  },
  {
    icon: <MessageSquare size={24} className="text-purple-400" />,
    title: "Discussions",
    desc: "Share your approach and learn from others in problem discussions.",
  },
  {
    icon: <Award size={24} className="text-pink-400" />,
    title: "Achievements",
    desc: "Unlock badges as you hit milestones and track your progress.",
  },
];

const problems = [
  { title: "Two Sum", difficulty: "Easy", tags: ["Array", "HashMap"] },
  { title: "Maximum Subarray", difficulty: "Medium", tags: ["Array", "DP"] },
  { title: "Contains Duplicate", difficulty: "Easy", tags: ["Array", "HashSet"] },
  { title: "Palindrome Number", difficulty: "Easy", tags: ["Math"] },
  { title: "FizzBuzz", difficulty: "Easy", tags: ["Math", "String"] },
];

const difficultyColors = {
  Easy: "text-green-400 bg-green-900/40 border border-green-800",
  Medium: "text-yellow-400 bg-yellow-900/40 border border-yellow-800",
  Hard: "text-red-400 bg-red-900/40 border border-red-800",
};

const stats = [
  { value: "5+", label: "Problems" },
  { value: "4", label: "Languages" },
  { value: "AI", label: "Powered Hints" },
  { value: "∞", label: "Learning" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 size={22} className="text-yellow-400" />
            <span className="font-bold text-lg text-white">LeetCode Clone</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-gray-400 hover:text-white transition text-sm font-medium px-3 py-1.5">
              Sign In
            </Link>
            <Link href="/register" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-1.5 rounded-lg transition text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Zap size={12} /> AI-Powered Coding Platform
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight">
            Master{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Coding
            </span>
            <br />
            One Problem at a Time
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Practice real coding problems, get AI hints when stuck, compete on the leaderboard, and level up your programming skills.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/register"
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3.5 rounded-xl transition text-base w-full sm:w-auto justify-center"
            >
              Start Coding Free <ChevronRight size={18} />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold px-8 py-3.5 rounded-xl transition text-base w-full sm:w-auto justify-center"
            >
              Sign In
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-10 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" /> Free to use</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" /> AI powered</span>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 px-4 sm:px-6 border-y border-gray-800 bg-gray-900/50">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-yellow-400 mb-1">{value}</div>
              <div className="text-gray-400 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to <span className="text-yellow-400">level up</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A complete coding practice platform with all the tools to help you succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-6 transition group">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  {icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problems Preview ── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Start with these <span className="text-yellow-400">problems</span>
            </h2>
            <p className="text-gray-400">Hand-picked problems to get you started on your coding journey.</p>
          </div>

          <div className="space-y-3 mb-8">
            {problems.map((problem, i) => (
              <div key={problem.title} className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl transition group">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 text-sm w-6">{i + 1}</span>
                  <div className="w-4 h-4 rounded-full border border-gray-600" />
                  <div>
                    <p className="text-white font-medium text-sm group-hover:text-yellow-400 transition">{problem.title}</p>
                    <div className="flex gap-1.5 mt-1">
                      {problem.tags.map((tag) => (
                        <span key={tag} className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${difficultyColors[problem.difficulty as keyof typeof difficultyColors]}`}>
                  {problem.difficulty}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3.5 rounded-xl transition"
            >
              Solve All Problems <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How it <span className="text-yellow-400">works</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Pick a Problem", desc: "Browse problems by difficulty — Easy, Medium, or Hard.", icon: "🎯" },
              { step: "02", title: "Write Your Code", desc: "Use our editor to write and test your solution.", icon: "💻" },
              { step: "03", title: "Submit & Level Up", desc: "Submit, earn points, unlock badges and climb the leaderboard.", icon: "🏆" },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="text-center">
                <div className="text-4xl mb-4">{icon}</div>
                <div className="text-yellow-400 text-xs font-bold tracking-widest mb-2">STEP {step}</div>
                <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-3xl p-10 sm:p-16 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Ready to start coding?
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                Join and start solving problems today. It's completely free!
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-10 py-4 rounded-xl transition text-lg"
              >
                Create Free Account <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Code2 size={18} className="text-yellow-400" />
            <span className="text-white font-bold">LeetCode Clone</span>
          </div>
          <p className="text-gray-500 text-sm">Built with Next.js, Node.js and ❤️</p>
          <div className="flex gap-4 text-sm text-gray-400">
            <Link href="/login" className="hover:text-white transition">Sign In</Link>
            <Link href="/register" className="hover:text-white transition">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
