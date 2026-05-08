"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import CodeEditor from "@/components/CodeEditor"; // MOST IMPORTANT frontend component.
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { Play, Send, ChevronLeft, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

const difficultyColors = {
  Easy: "text-green-400 bg-green-900",
  Medium: "text-yellow-400 bg-yellow-900",
  Hard: "text-red-400 bg-red-900",
};

const statusColors = {
  Accepted: "text-green-400",
  "Wrong Answer": "text-red-400",
  "Time Limit Exceeded": "text-yellow-400",
  "Runtime Error": "text-red-400",
  "Compilation Error": "text-red-400",
  Pending: "text-gray-400",
};

export default function ProblemDetailPage() {
  const { id } = useParams();

  // ✅ ALL hooks at top
  const { user, loading: authLoading } = useAuth();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeTab, setActiveTab] = useState("description"); // description | results
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    fetchProblem();
  }, [id, authLoading]);

  const fetchProblem = async () => {
    try {
      const res = await api.get(`/problems/${id}`);
      setProblem(res.data.problem);
      setIsSolved(res.data.isSolved);
      // Load starter code
      const starter = res.data.problem.starterCode?.javascript || "";
      setCode(starter);
    } catch {
      toast.error("Failed to fetch problem");
    } finally {
      setLoading(false);
    }
  };

  const handleRun = async () => {
    if (!code.trim()) return toast.error("Please write some code first!");
    setRunning(true);
    setRunResults(null);
    try {
      const res = await api.post("/submissions/run", {
        code,
        language,
        problemId: id,
      });
      setRunResults(res.data.results);
      setActiveTab("results"); // Automatically opens results panel.
      toast.success("Code executed!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) return toast.error("Please write some code first!");
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const res = await api.post("/submissions/submit", {
        code,
        language,
        problemId: id,
      });
      setSubmitResult(res.data);
      setActiveTab("results");
      if (res.data.submission.status === "Accepted") {
        setIsSolved(true);
        toast.success("🎉 Accepted! All test cases passed!");
      } else {
        toast.error(res.data.submission.status);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen bg-gray-950 items-center justify-center">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex min-h-screen bg-gray-950 items-center justify-center">
        <p className="text-gray-400 text-lg">Problem not found!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Toaster position="top-right" />
      <Navbar user={user} />

      {/* Main content - split screen */}
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 65px)" }}>

        {/* LEFT SIDE — Problem description */}
        <div className="w-1/2 flex flex-col border-r border-gray-800 overflow-y-auto">
          {/* Problem header */}
          <div className="p-6 border-b border-gray-800">
            <Link
              href="/problems"
              className="flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-4 transition"
            >
              <ChevronLeft size={16} />
              Back to Problems
            </Link>

            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold text-white">{problem.title}</h1>
              {isSolved && <CheckCircle size={20} className="text-green-400" />}
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${difficultyColors[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
              {problem.tags?.map((tag) => (
                <span key={tag} className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-6 py-3 text-sm font-medium transition ${
                activeTab === "description"
                  ? "text-white border-b-2 border-yellow-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("results")}
              className={`px-6 py-3 text-sm font-medium transition ${
                activeTab === "results"
                  ? "text-white border-b-2 border-yellow-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Results
            </button>
          </div>

          {/* Tab content */}
          <div className="p-6 flex-1">
            {activeTab === "description" ? (
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <p className="text-gray-300 leading-relaxed">{problem.description}</p>
                </div>

                {/* Examples */}
                {problem.examples?.map((example, i) => (
                  <div key={i}>
                    <h3 className="text-white font-semibold mb-2">Example {i + 1}:</h3>
                    <div className="bg-gray-800 rounded-lg p-4 space-y-2">
                      <div>
                        <span className="text-gray-400 text-sm">Input: </span>
                        <code className="text-green-400 text-sm">{example.input}</code>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Output: </span>
                        <code className="text-yellow-400 text-sm">{example.output}</code>
                      </div>
                      {example.explanation && (
                        <div>
                          <span className="text-gray-400 text-sm">Explanation: </span>
                          <span className="text-gray-300 text-sm">{example.explanation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Constraints */}
                {problem.constraints && (
                  <div>
                    <h3 className="text-white font-semibold mb-2">Constraints:</h3>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <pre className="text-gray-300 text-sm whitespace-pre-wrap">
                        {problem.constraints}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Submit Result */}
                {submitResult && (
                  <div className={`bg-gray-800 rounded-xl p-4 border ${
                    submitResult.submission.status === "Accepted"
                      ? "border-green-500"
                      : "border-red-500"
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {submitResult.submission.status === "Accepted" ? (
                        <CheckCircle size={20} className="text-green-400" />
                      ) : (
                        <XCircle size={20} className="text-red-400" />
                      )}
                      <span className={`font-bold text-lg ${statusColors[submitResult.submission.status]}`}>
                        {submitResult.submission.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {submitResult.testCasesPassed} / {submitResult.totalTestCases} test cases passed
                    </p>
                    {submitResult.submission.runtime > 0 && (
                      <p className="text-gray-400 text-sm">
                        Runtime: {submitResult.submission.runtime}ms
                      </p>
                    )}
                  </div>
                )}

                {/* Run Results */}
                {runResults && (
                  <div className="space-y-3">
                    <h3 className="text-white font-semibold">Test Results:</h3>
                    {runResults.map((result, i) => (
                      <div
                        key={i}
                        className={`bg-gray-800 rounded-xl p-4 border ${
                          result.passed ? "border-green-700" : "border-red-700"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {result.passed ? (
                            <CheckCircle size={16} className="text-green-400" />
                          ) : (
                            <XCircle size={16} className="text-red-400" />
                          )}
                          <span className={result.passed ? "text-green-400" : "text-red-400"}>
                            {result.passed ? "Passed" : "Failed"}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-400">
                            Input: <code className="text-gray-300">{result.input}</code>
                          </p>
                          <p className="text-gray-400">
                            Expected: <code className="text-green-400">{result.expectedOutput}</code>
                          </p>
                          <p className="text-gray-400">
                            Got: <code className={result.passed ? "text-green-400" : "text-red-400"}>
                              {result.actualOutput || "No output"}
                            </code>
                          </p>
                          {result.error && (
                            <p className="text-red-400 text-xs mt-2">{result.error}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!submitResult && !runResults && (
                  <div className="text-center mt-10">
                    <p className="text-gray-400">
                      Run or submit your code to see results here!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE — Code Editor */}
        <div className="w-1/2 flex flex-col">
          {/* Editor */}
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              code={code}
              language={language}
              onChange={setCode}
              onLanguageChange={setLanguage}
              starterCode={problem.starterCode}
            />
          </div>

          {/* Bottom bar - Run and Submit buttons */}
          <div className="bg-gray-900 border-t border-gray-800 px-6 py-4 flex items-center justify-between">
            <div className="text-gray-400 text-sm">
              {isSolved && (
                <span className="flex items-center gap-1 text-green-400">
                  <CheckCircle size={14} />
                  Solved
                </span>
              )}
            </div>

            <div className="flex gap-3">
              {/* Run button */}
              <button
                onClick={handleRun}
                disabled={running || submitting}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
              >
                <Play size={16} />
                {running ? "Running..." : "Run"}
              </button>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={running || submitting}
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
              >
                <Send size={16} />
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
