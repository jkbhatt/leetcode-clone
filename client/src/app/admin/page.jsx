"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Trash2, Pencil, LayoutDashboard, BookOpen, X, ChevronRight, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

const difficultyColors = {
  Easy: "text-green-400 bg-green-900/40 border border-green-800",
  Medium: "text-yellow-400 bg-yellow-900/40 border border-yellow-800",
  Hard: "text-red-400 bg-red-900/40 border border-red-800",
};

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard | add
  const [problems, setProblems] = useState([]);
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // problem id to delete

  const [form, setForm] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    tags: "",
    constraints: "",
    starterCode: {
      javascript: "function solution() {\n    // Write your solution here\n}",
      python: "def solution():\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public void solution() {\n        // Write your solution here\n    }\n}",
      cpp: "class Solution {\npublic:\n    void solution() {\n        // Write your solution here\n    }\n};",
    },
  });

  const [examples, setExamples] = useState([{ input: "", output: "", explanation: "" }]);
  const [testCases, setTestCases] = useState([{ input: "", output: "" }]);

  useEffect(() => {
    if (authLoading) return;
    if (user?.role !== "admin") {
      router.push("/problems");
      return;
    }
    fetchProblems();
  }, [authLoading, user]);

  const fetchProblems = async () => {
    try {
      const res = await api.get("/problems");
      setProblems(res.data.problems || []);
    } catch {
      toast.error("Failed to fetch problems");
    } finally {
      setLoadingProblems(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/problems/${id}`);
      setProblems(problems.filter((p) => p._id !== id));
      toast.success("Problem deleted!");
      setDeleteConfirm(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAddExample = () => setExamples([...examples, { input: "", output: "", explanation: "" }]);
  const handleRemoveExample = (i) => setExamples(examples.filter((_, idx) => idx !== i));
  const handleExampleChange = (i, field, value) => {
    const updated = [...examples];
    updated[i][field] = value;
    setExamples(updated);
  };

  const handleAddTestCase = () => setTestCases([...testCases, { input: "", output: "" }]);
  const handleRemoveTestCase = (i) => setTestCases(testCases.filter((_, idx) => idx !== i));
  const handleTestCaseChange = (i, field, value) => {
    const updated = [...testCases];
    updated[i][field] = value;
    setTestCases(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/problems", {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        examples,
        testCases,
      });
      toast.success("Problem added successfully!");
      fetchProblems();
      setActiveTab("dashboard");
      setForm({
        title: "", description: "", difficulty: "Easy", tags: "", constraints: "",
        starterCode: {
          javascript: "function solution() {\n    // Write your solution here\n}",
          python: "def solution():\n    # Write your solution here\n    pass",
          java: "class Solution {\n    public void solution() {\n        // Write your solution here\n    }\n}",
          cpp: "class Solution {\npublic:\n    void solution() {\n        // Write your solution here\n    }\n};",
        },
      });
      setExamples([{ input: "", output: "", explanation: "" }]);
      setTestCases([{ input: "", output: "" }]);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-gray-950 items-center justify-center">
        <div className="w-10 h-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user?.role !== "admin") return null;

  const easyCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardCount = problems.filter((p) => p.difficulty === "Hard").length;

  const inputClass = "w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-500 text-sm border border-gray-700";
  const labelClass = "block text-sm text-gray-400 mb-1.5 font-medium";

  return (
    <div className="min-h-screen bg-gray-950">
      <Toaster position="top-right" />
      <Navbar user={user} />

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-900/50 rounded-full flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Delete Problem</h3>
                <p className="text-gray-400 text-sm">This action cannot be undone</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-xl transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl transition text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-1">Manage your coding problems</p>
          </div>
          <button
            onClick={() => setActiveTab(activeTab === "add" ? "dashboard" : "add")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === "add"
                ? "bg-gray-700 text-white"
                : "bg-yellow-500 hover:bg-yellow-600 text-black"
            }`}
          >
            {activeTab === "add" ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Problem</>}
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Problems", value: problems.length, color: "text-white", bg: "border-gray-700" },
            { label: "Easy", value: easyCount, color: "text-green-400", bg: "border-green-800" },
            { label: "Medium", value: mediumCount, color: "text-yellow-400", bg: "border-yellow-800" },
            { label: "Hard", value: hardCount, color: "text-red-400", bg: "border-red-800" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`bg-gray-900 rounded-2xl p-4 border ${bg}`}>
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-gray-400 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
          {[
            { id: "dashboard", label: "Problems", icon: <BookOpen size={15} /> },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === id
                  ? "bg-yellow-500 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* ── Dashboard Tab ── */}
        {activeTab === "dashboard" && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            {loadingProblems ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : problems.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen size={40} className="text-gray-700 mx-auto mb-3" />
                <p className="text-gray-400 mb-4">No problems yet</p>
                <button
                  onClick={() => setActiveTab("add")}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-xl text-sm font-semibold transition"
                >
                  Add First Problem
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {/* Table Header */}
                <div className="grid grid-cols-12 px-6 py-3 text-xs text-gray-500 uppercase tracking-wide">
                  <div className="col-span-5">Problem</div>
                  <div className="col-span-2">Difficulty</div>
                  <div className="col-span-3">Tags</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {problems.map((problem, i) => (
                  <div key={problem._id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-800/50 transition">
                    <div className="col-span-5">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600 text-sm w-5">{i + 1}</span>
                        <div>
                          <p className="text-white text-sm font-medium">{problem.title}</p>
                          <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{problem.description?.slice(0, 50)}...</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${difficultyColors[problem.difficulty]}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <div className="col-span-3 flex gap-1 flex-wrap">
                      {problem.tags?.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs text-gray-400 bg-gray-800 border border-gray-700 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/edit/${problem._id}`}
                        className="p-2 bg-gray-800 hover:bg-blue-900/50 border border-gray-700 hover:border-blue-700 text-gray-400 hover:text-blue-400 rounded-lg transition"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(problem._id)}
                        className="p-2 bg-gray-800 hover:bg-red-900/50 border border-gray-700 hover:border-red-700 text-gray-400 hover:text-red-400 rounded-lg transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Add Problem Tab ── */}
        {activeTab === "add" && (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Basic Info */}
            <div className="bg-gray-900 rounded-2xl p-6 space-y-4 border border-gray-800">
              <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                <LayoutDashboard size={18} className="text-yellow-400" />
                Basic Information
              </h3>

              <div>
                <label className={labelClass}>Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="e.g. Two Sum"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  placeholder="Problem description..."
                  rows={5}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Difficulty</label>
                  <select
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                    className={inputClass}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Tags (comma separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="Array, HashMap, DP"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Constraints</label>
                <textarea
                  value={form.constraints}
                  onChange={(e) => setForm({ ...form, constraints: e.target.value })}
                  rows={3}
                  placeholder="e.g. 1 <= nums.length <= 10^4"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            {/* Examples */}
            <div className="bg-gray-900 rounded-2xl p-6 space-y-4 border border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg">Examples <span className="text-gray-500 text-sm font-normal">(visible to users)</span></h3>
                <button type="button" onClick={handleAddExample} className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 text-sm transition">
                  <Plus size={16} /> Add
                </button>
              </div>
              {examples.map((example, i) => (
                <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm font-medium">Example {i + 1}</span>
                    {examples.length > 1 && (
                      <button type="button" onClick={() => handleRemoveExample(i)} className="text-red-400 hover:text-red-300 transition">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <input type="text" value={example.input} onChange={(e) => handleExampleChange(i, "input", e.target.value)} placeholder="Input" className={inputClass} />
                  <input type="text" value={example.output} onChange={(e) => handleExampleChange(i, "output", e.target.value)} placeholder="Output" className={inputClass} />
                  <input type="text" value={example.explanation} onChange={(e) => handleExampleChange(i, "explanation", e.target.value)} placeholder="Explanation (optional)" className={inputClass} />
                </div>
              ))}
            </div>

            {/* Test Cases */}
            <div className="bg-gray-900 rounded-2xl p-6 space-y-4 border border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg">Test Cases <span className="text-gray-500 text-sm font-normal">(hidden from users)</span></h3>
                <button type="button" onClick={handleAddTestCase} className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 text-sm transition">
                  <Plus size={16} /> Add
                </button>
              </div>
              {testCases.map((tc, i) => (
                <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm font-medium">Test Case {i + 1}</span>
                    {testCases.length > 1 && (
                      <button type="button" onClick={() => handleRemoveTestCase(i)} className="text-red-400 hover:text-red-300 transition">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <textarea value={tc.input} onChange={(e) => handleTestCaseChange(i, "input", e.target.value)} placeholder="Input (stdin)" rows={2} className={`${inputClass} resize-none font-mono`} />
                  <textarea value={tc.output} onChange={(e) => handleTestCaseChange(i, "output", e.target.value)} placeholder="Expected Output" rows={2} className={`${inputClass} resize-none font-mono`} />
                </div>
              ))}
            </div>

            {/* Starter Code */}
            <div className="bg-gray-900 rounded-2xl p-6 space-y-4 border border-gray-800">
              <h3 className="text-white font-semibold text-lg">Starter Code</h3>
              {["javascript", "python", "java", "cpp"].map((lang) => (
                <div key={lang}>
                  <label className={labelClass}>{lang.toUpperCase()}</label>
                  <textarea
                    value={form.starterCode[lang]}
                    onChange={(e) => setForm({ ...form, starterCode: { ...form.starterCode, [lang]: e.target.value } })}
                    rows={4}
                    className={`${inputClass} resize-none font-mono`}
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setActiveTab("dashboard")} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 rounded-xl transition">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 rounded-xl transition disabled:opacity-50 text-lg">
                {submitting ? "Adding..." : "Add Problem"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
