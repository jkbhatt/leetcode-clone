"use client";
import Editor from "@monaco-editor/react";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
];

// Monaco language mapping
const MONACO_LANGUAGE_MAP = {
  javascript: "javascript",
  python: "python",
  java: "java",
  cpp: "cpp",
};

export default function CodeEditor({
  code,
  language,
  onChange,
  onLanguageChange,
  starterCode,
}) {
  const handleLanguageChange = (newLanguage) => {
    onLanguageChange(newLanguage);
    // Load starter code for new language
    if (starterCode && starterCode[newLanguage]) {
      onChange(starterCode[newLanguage]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Language selector */}
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="bg-gray-700 text-white text-sm rounded px-3 py-1.5 outline-none focus:ring-1 focus:ring-yellow-500"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>

        <span className="text-gray-400 text-xs">
          Press Ctrl+Space for autocomplete
        </span>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={MONACO_LANGUAGE_MAP[language]}
          value={code}
          onChange={(value) => onChange(value || "")}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "JetBrains Mono, Fira Code, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            lineNumbers: "on",
            renderLineHighlight: "all",
            cursorBlinking: "smooth",
            smoothScrolling: true,
            contextmenu: true,
            formatOnPaste: true,
            suggestOnTriggerCharacters: true,
          }}
        />
      </div>
    </div>
  );
}
