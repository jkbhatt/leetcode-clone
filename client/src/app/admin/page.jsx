"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  const { user, loading: authLoading } = useAuth();

  const [submitting, setSubmitting] = useState(false);

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

  const [examples, setExamples] = useState([
    { input: "", output: "", explanation: "" },
  ]);

  const [testCases, setTestCases] = useState([
    { input: "", output: "" },
  ]);

  if (authLoading) {
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
    setExamples([
      ...examples,
      { input: "", output: "", explanation: "" },
    ]);
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
      await api.post("/problems", {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        examples,
        testCases,
      });

      toast.success("Problem added successfully!");

      setForm({
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

      setExamples([
        { input: "", output: "", explanation: "" },
      ]);

      setTestCases([
        { input: "", output: "" },
      ]);

    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-500 text-sm";

  const labelClass =
    "block text-sm text-gray-400 mb-1";

  return (
    <div className="min-h-screen bg-gray-950">
      <Toaster position="top-right" />

      <Navbar user={user} />

      <main className="max-w-4xl mx-auto px-4 py-8">

        <div className="mb-8">

          <h2 className="text-2xl font-bold text-white">
            Admin Panel
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Add new coding problems
          </p>

          <div className="mt-4">
            <Link
              href="/problems"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Edit Existing Problems
            </Link>
          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div className="bg-gray-900 rounded-2xl p-6 space-y-4">

            <h3 className="text-white font-semibold text-lg">
              Basic Information
            </h3>

            <div>
              <label className={labelClass}>
                Title
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                required
                placeholder="e.g. Two Sum"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                required
                placeholder="Problem description..."
                rows={5}
                className={`${inputClass} resize-none`}
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 rounded-xl transition disabled:opacity-50 text-lg"
          >
            {submitting
              ? "Adding Problem..."
              : "Add Problem"}
          </button>

        </form>
      </main>
    </div>
  );
}