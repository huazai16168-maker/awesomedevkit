"use client";

import { useMemo, useState } from "react";
import type { Metadata } from "next";

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("(\\w+)@(\\w+\\.\\w+)");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("hello@example.com\nuser@test.org\ninvalid-email");

  const result = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags);
      const matches: { full: string; groups: string[]; index: number }[] = [];
      let match;
      let matchCount = 0;

      for (const line of testString.split("\n")) {
        const re = new RegExp(regex.source, regex.flags.includes("g") ? regex.flags : regex.flags + "g");
        while ((match = re.exec(line)) !== null) {
          const groups: string[] = [];
          for (let i = 1; i < match.length; i++) {
            if (match[i] !== undefined) groups.push(match[i]);
          }
          matches.push({ full: match[0], groups, index: match.index });
          matchCount++;
          if (match.index === re.lastIndex) re.lastIndex++;
        }
      }

      return { valid: true as const, matches, matchCount, error: null };
    } catch (e) {
      return { valid: false as const, matches: [], matchCount: 0, error: (e as Error).message };
    }
  }, [pattern, flags, testString]);

  return (
    <main>
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="container">
          <p className="eyebrow">Free developer utility</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-normal md:text-5xl">
            Regex Tester
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Test and debug regular expressions in real time. Highlighted matches, capture groups, and error detection.
          </p>
        </div>
      </section>

      <section className="container grid gap-6 py-10 lg:grid-cols-2">
        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-bold">Pattern</span>
            <input
              className="rounded-lg border border-slate-300 px-3 py-3 font-mono text-sm"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-bold">Flags</span>
            <input
              className="rounded-lg border border-slate-300 px-3 py-3 font-mono text-sm"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="g, i, m, s, u"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-bold">Test string</span>
            <textarea
              className="min-h-48 rounded-lg border border-slate-300 px-3 py-3 font-mono text-sm"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter test strings, one per line"
            />
          </label>
        </div>

        <div className="grid gap-5 content-start">
          {result.valid ? (
            <>
              <div className={`rounded-lg border p-5 ${result.matchCount > 0 ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}>
                <p className="text-sm font-bold">
                  {result.matchCount} match{result.matchCount !== 1 ? "es" : ""} found
                </p>
                <div className="mt-3 rounded-md border border-slate-200 bg-white p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  {highlightMatches(pattern, flags, testString)}
                </div>
              </div>

              {result.matches.length > 0 && (
                <div className="rounded-lg border border-slate-200 bg-white p-5">
                  <p className="text-sm font-bold mb-3">Capture groups</p>
                  <div className="grid gap-2">
                    {result.matches.slice(0, 10).map((m, i) => (
                      <div key={i} className="rounded-md bg-slate-50 p-3 text-sm">
                        <span className="font-semibold">#{i + 1}</span>{" "}
                        <span className="font-mono text-emerald-700">{m.full}</span>
                        {m.groups.length > 0 && (
                          <span className="ml-2 text-slate-500">
                            → groups: [{m.groups.join(", ")}]
                          </span>
                        )}
                        <span className="ml-2 text-xs text-slate-400">
                          (pos: {m.index})
                        </span>
                      </div>
                    ))}
                    {result.matches.length > 10 && (
                      <p className="text-xs text-slate-500 mt-2">
                        ... and {result.matches.length - 10} more matches
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-red-300 bg-red-50 p-5">
              <p className="font-bold text-red-800">Invalid pattern</p>
              <p className="mt-2 font-mono text-sm text-red-700">{result.error}</p>
            </div>
          )}

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm font-bold">Quick reference</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
              <span><code className="font-mono font-bold">.</code> any char</span>
              <span><code className="font-mono font-bold">\d</code> digit</span>
              <span><code className="font-mono font-bold">\w</code> word char</span>
              <span><code className="font-mono font-bold">\s</code> whitespace</span>
              <span><code className="font-mono font-bold">*</code> 0 or more</span>
              <span><code className="font-mono font-bold">+</code> 1 or more</span>
              <span><code className="font-mono font-bold">?</code> 0 or 1</span>
              <span><code className="font-mono font-bold">\b</code> word boundary</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-10">
        <div className="container">
          <div className="rounded-lg border border-slate-200 bg-[#f7f4ef] p-6">
            <p className="text-sm font-bold">Need help writing complex regex patterns?</p>
            <p className="mt-2 text-sm text-slate-600">
              If you are building advanced validation, data extraction, or parsing logic,
              send us your use case and we can help with pattern design.
            </p>
            <a
              className="btn mt-4 inline-flex"
              href="mailto:huazai16168@gmail.com?subject=Regex%20help%20request"
            >
              Request regex help
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

/* Highlight matches in text */
function highlightMatches(pattern: string, flags: string, text: string): React.ReactNode {
  try {
    const regex = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(
        <mark key={match.index} className="bg-emerald-200 rounded px-0.5">
          {match[0]}
        </mark>
      );
      lastIndex = match.index + match[0].length;
      if (match.index === regex.lastIndex) regex.lastIndex++;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts.length > 0 ? parts : text;
  } catch {
    return text;
  }
}
