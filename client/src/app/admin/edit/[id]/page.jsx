"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Trash2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function EditProblemPage() {
  const router = useRouter();
  const { id } = useParams();

  const { user, loading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    tags: "",
    constraints: "",
    starterCode: {
      javascript: "",
      python: "",
      java: "",
      cpp: "",
    },
  });

  const [examples, setExamples] = useState([
    { input: "", output: "", explanation: "" },
  ]);

  const [testCases, setTestCases] = useState([
    { input: "", output: "" },
  ]);

  // ✅ Fetch existing problem data
  useEffect(() => {
    if (authLoading) return;
    fetchProblem();
  }, [authLoading, id]);

  const fetchProblem = async () => {
    try {
      const res = await api.get(`/problems/${id}`);
      const problem = res.data.problem;

      setForm({
        title: problem.title || "",
        description: problem.description || "",
        difficulty: problem.difficulty || "Easy",
        tags: problem.tags?.join(", ") || "",
        constraints: problem.constraints || "",
        starterCode: {
          javascript: problem.starterCode?.javascript || "",
          python: problem.starterCode?.python || "",
          java: problem.starterCode?.java || "",
          cpp: problem.starterCode?.cpp || "",
        },
      });

      setExamples(
        problem.examples?.length > 0
          ? problem.examples
          : [{ input: "", output: "", explanation: "" }]
      );

      setTestCases(
        problem.testCases?.length > 0
          ? problem.testCases
          : [{ input: "", output: "" }]
      );
    } catch {
      toast.error("Failed to fetch problem");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen bg-gray-950 items-center justify-center">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    );
  }

  if (user?.role !== "admin") {
    router.push("/problems");
    return null;
  }

  const handleAddExample = () => {
    setExamples([...examples, { input: "", output: "", explanation: "" }]);
  };

  const handleRemoveExample = (index) => {
    setExamples(examples.filter((_, i) => i !== index));
  };

  const handleExampleChange = (index, field, value) => {
    const updated = [...examples];
    updated[index][field] = value;
    setExamples(updated);
  };

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: "", output: "" }]);
  };

  const handleRemoveTestCase = (index) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/problems/${id}`, {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        examples,
        testCases,
      });
      toast.success("Problem updated successfully!");
      setTimeout(() => router.push("/admin"), 1500);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-500 text-sm";
  const labelClass = "block text-sm text-gray-400 mb-1";

  return (
    <div className="min-h-screen bg-gray-950">
      <Toaster position="top-right" />
      <Navbar user={user} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Edit Problem</h2>
            <p className="text-gray-400 text-sm mt-1">Update problem details</p>
          </div>
          <button
            onClick={() => router.push("/admin")}
            className="text-gray-400 hover:text-white text-sm transition"
          >
            ← Back to Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
            <h3 className="text-white font-semibold text-lg">Basic Information</h3>

            <div>
              <label className={labelClass}>Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
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
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          {/* Examples */}
          <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">Examples (visible to users)</h3>
              <button
                type="button"
                onClick={handleAddExample}
                className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 text-sm"
              >
                <Plus size={16} />
                Add Example
              </button>
            </div>

            {examples.map((example, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm font-medium">Example {i + 1}</span>
                  {examples.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveExample(i)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={example.input}
                  onChange={(e) => handleExampleChange(i, "input", e.target.value)}
                  placeholder="Input"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={example.output}
                  onChange={(e) => handleExampleChange(i, "output", e.target.value)}
                  placeholder="Output"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={example.explanation}
                  onChange={(e) => handleExampleChange(i, "explanation", e.target.value)}
                  placeholder="Explanation (optional)"
                  className={inputClass}
                />
              </div>
            ))}
          </div>

          {/* Test Cases */}
          <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">Test Cases (hidden from users)</h3>
              <button
                type="button"
                onClick={handleAddTestCase}
                className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 text-sm"
              >
                <Plus size={16} />
                Add Test Case
              </button>
            </div>

            {testCases.map((tc, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm font-medium">Test Case {i + 1}</span>
                  {testCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTestCase(i)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <textarea
                  value={tc.input}
                  onChange={(e) => handleTestCaseChange(i, "input", e.target.value)}
                  placeholder="Input (stdin) - no prefixes like INPUT:"
                  rows={2}
                  className={`${inputClass} resize-none font-mono`}
                />
                <textarea
                  value={tc.output}
                  onChange={(e) => handleTestCaseChange(i, "output", e.target.value)}
                  placeholder="Expected Output - no prefixes like OUTPUT:"
                  rows={2}
                  className={`${inputClass} resize-none font-mono`}
                />
              </div>
            ))}
          </div>

          {/* Starter Code */}
          <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
            <h3 className="text-white font-semibold text-lg">Starter Code</h3>

            {["javascript", "python", "java", "cpp"].map((lang) => (
              <div key={lang}>
                <label className={labelClass}>{lang.toUpperCase()}</label>
                <textarea
                  value={form.starterCode[lang]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      starterCode: { ...form.starterCode, [lang]: e.target.value },
                    })
                  }
                  rows={4}
                  className={`${inputClass} resize-none font-mono`}
                />
              </div>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 rounded-xl transition disabled:opacity-50 text-lg"
          >
            {submitting ? "Updating..." : "Update Problem"}
          </button>
        </form>
      </main>
    </div>
  );
}
