"use client";

import { useState, useMemo } from "react";

export default function DiffCheckerPage() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");

  const diffLines = useMemo(() => {
    if (!original && !modified) return [];

    const origLines = original.split("\n");
    const modLines = modified.split("\n");

    // Simple LCS diff
    const dp: number[][] = Array(origLines.length + 1).fill(null).map(() => Array(modLines.length + 1).fill(0));
    for (let i = 1; i <= origLines.length; i++) {
      for (let j = 1; j <= modLines.length; j++) {
        if (origLines[i - 1] === modLines[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // Backtrack
    type Line = { type: "added" | "removed" | "unchanged"; text: string };
    const result: Line[] = [];
    let i = origLines.length;
    let j = modLines.length;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && origLines[i - 1] === modLines[j - 1]) {
        result.unshift({ type: "unchanged", text: origLines[i - 1] });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        result.unshift({ type: "added", text: modLines[j - 1] });
        j--;
      } else if (i > 0) {
        result.unshift({ type: "removed", text: origLines[i - 1] });
        i--;
      }
    }

    return result;
  }, [original, modified]);

  const stats = useMemo(() => {
    const added = diffLines.filter((l) => l.type === "added").length;
    const removed = diffLines.filter((l) => l.type === "removed").length;
    return { added, removed, total: diffLines.length };
  }, [diffLines]);

  return (
    <main>
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="container">
          <p className="eyebrow">Free developer utility — no server, no upload</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-normal md:text-5xl">
            Diff Checker
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Compare two blocks of text or code side by side. See every line added, removed, or unchanged.
          </p>
        </div>
      </section>

      <section className="container grid gap-6 py-10 lg:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-bold">Original text</span>
          <textarea
            className="min-h-64 rounded-lg border border-slate-300 px-3 py-3 font-mono text-sm"
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste original text here..."
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-bold">Modified text</span>
          <textarea
            className="min-h-64 rounded-lg border border-slate-300 px-3 py-3 font-mono text-sm"
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste modified text here..."
          />
        </label>
      </section>

      {diffLines.length > 0 && (
        <section className="container pb-10">
          <div className="flex items-center gap-4 mb-4 text-sm">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-200" /> +{stats.added} added
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-red-200" /> -{stats.removed} removed
            </span>
            <span className="text-slate-400">{stats.total} total lines</span>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
            <div className="font-mono text-sm leading-relaxed">
              {diffLines.map((line, i) => (
                <div
                  key={i}
                  className={`flex ${
                    line.type === "added" ? "bg-emerald-50" : line.type === "removed" ? "bg-red-50" : ""
                  }`}
                >
                  <span className="flex-shrink-0 w-6 text-center text-xs text-slate-400 select-none py-0.5 border-r border-slate-100">
                    {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                  </span>
                  <span
                    className={`flex-1 px-3 py-0.5 whitespace-pre-wrap ${
                      line.type === "added"
                        ? "text-emerald-800"
                        : line.type === "removed"
                        ? "text-red-800"
                        : "text-slate-700"
                    }`}
                  >
                    {line.text || " "}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-slate-200 bg-white py-10">
        <div className="container">
          <div className="rounded-lg border border-slate-200 bg-[#f7f4ef] p-6">
            <p className="text-sm font-bold">Need advanced diff tools for your team?</p>
            <p className="mt-2 text-sm text-slate-600">
              Reach out if you need help with code review, merge conflict resolution, or automated diff pipelines.
            </p>
            <a
              className="btn mt-4 inline-flex"
              href="mailto:huazai16168@gmail.com?subject=Diff%20tool%20help"
            >
              Get help
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
