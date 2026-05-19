"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import CodeEditor from "@/components/CodeEditor";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { Play, Send, ChevronLeft, CheckCircle, XCircle, Lightbulb, X, ChevronRight } from "lucide-react";
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

  const { user, loading: authLoading } = useAuth();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [isSolved, setIsSolved] = useState(false);

  // ✅ Hint state
  const [showHintPanel, setShowHintPanel] = useState(false);
  const [hintLevel, setHintLevel] = useState(1);
  const [hints, setHints] = useState(null);
  const [hintLoading, setHintLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    fetchProblem();
  }, [id, authLoading]);

  const fetchProblem = async () => {
    try {
      const res = await api.get(`/problems/${id}`);
      setProblem(res.data.problem);
      setIsSolved(res.data.isSolved);
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
      setActiveTab("results");
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

  // ✅ Fetch hint from backend
  const handleGetHint = async () => {
  setHintLoading(true);
  setHints(null);
  try {
    const res = await api.post("/hints", {
      problemId: id,
      userCode: code,
      language,
      hintLevel,
    });
    console.log("HINT RESPONSE:", JSON.stringify(res));
    setHints(res.data.hints);
    toast.success(`Level ${hintLevel} hint generated!`);
  } catch (err) {
    console.log("HINT ERROR:", err.message); // ✅ just err.message
    toast.error(err.message || "Failed to get hint"); // ✅ fixed
  } finally {
    setHintLoading(false);
  }
};

  const openHintPanel = () => {
    setShowHintPanel(true);
    setHints(null);
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
                <div>
                  <p className="text-gray-300 leading-relaxed">{problem.description}</p>
                </div>

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

        {/* RIGHT SIDE — Code Editor + Hint Panel */}
        <div className="w-1/2 flex flex-col relative">

          {/* ✅ Hint Panel Overlay */}
          {showHintPanel && (
            <div className="absolute inset-0 z-10 bg-gray-900 flex flex-col border-l border-gray-700">
              {/* Hint Panel Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-900">
                <div className="flex items-center gap-2">
                  <Lightbulb size={18} className="text-yellow-400" />
                  <span className="text-white font-semibold">AI Hint</span>
                </div>
                <button
                  onClick={() => setShowHintPanel(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Hint Level Selector */}
              <div className="px-6 py-4 border-b border-gray-700">
                <p className="text-gray-400 text-sm mb-3">Select hint level:</p>
                <div className="flex gap-2">
                  {[
                    { level: 1, label: "Gentle", color: "border-green-500 text-green-400" },
                    { level: 2, label: "Medium", color: "border-yellow-500 text-yellow-400" },
                    { level: 3, label: "Strong", color: "border-red-500 text-red-400" },
                  ].map(({ level, label, color }) => (
                    <button
                      key={level}
                      onClick={() => { setHintLevel(level); setHints(null); }}
                      className={`flex-1 py-2 rounded-lg border text-sm font-medium transition ${
                        hintLevel === level
                          ? `${color} bg-gray-800`
                          : "border-gray-600 text-gray-400 hover:border-gray-400"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleGetHint}
                  disabled={hintLoading}
                  className="w-full mt-3 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
                >
                  <Lightbulb size={16} />
                  {hintLoading ? "Generating hint..." : "Get Hint"}
                </button>
              </div>

              {/* Hint Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {hintLoading && (
                  <div className="flex items-center justify-center mt-10">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">AI is thinking...</p>
                    </div>
                  </div>
                )}

                {hints && !hintLoading && (
                  <div className="space-y-4">
                    {/* Logic Hint */}
                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-400 text-xs font-semibold uppercase tracking-wide">Logic</span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{hints.logicHint}</p>
                    </div>

                    {/* Complexity Hint */}
                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-purple-400 text-xs font-semibold uppercase tracking-wide">Complexity</span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{hints.complexityHint}</p>
                    </div>

                    {/* Edge Case Hint */}
                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-orange-400 text-xs font-semibold uppercase tracking-wide">Edge Cases</span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{hints.edgeCaseHint}</p>
                    </div>

                    {/* Encouragement */}
                    <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/30">
                      <p className="text-yellow-300 text-sm leading-relaxed">💪 {hints.encouragement}</p>
                    </div>

                    {/* Level up button */}
                    {hintLevel < 3 && (
                      <button
                        onClick={() => { setHintLevel(h => h + 1); setHints(null); }}
                        className="w-full flex items-center justify-center gap-1 text-gray-400 hover:text-white text-sm py-2 transition"
                      >
                        Need a stronger hint? <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                )}

                {!hints && !hintLoading && (
                  <div className="text-center mt-10">
                    <Lightbulb size={40} className="text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">Select a hint level and click Get Hint</p>
                    <p className="text-gray-600 text-xs mt-1">Your current code will be analyzed</p>
                  </div>
                )}
              </div>
            </div>
          )}

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

          {/* Bottom bar */}
          <div className="bg-gray-900 border-t border-gray-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isSolved && (
                <span className="flex items-center gap-1 text-green-400 text-sm">
                  <CheckCircle size={14} />
                  Solved
                </span>
              )}

              {/* ✅ Hint Button */}
              <button
                onClick={openHintPanel}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-yellow-400 text-yellow-400 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                <Lightbulb size={15} />
                Hint
              </button>
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
