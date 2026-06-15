"use client";

import { useMemo, useState } from "react";

export default function JsonFormatterPage() {
  const [input, setInput] = useState(
    '{\n  "name": "AwesomeDevKit",\n  "version": "1.0.0",\n  "tools": ["regex tester", "cron gen", "json fmt"],\n  "nested": {\n    "enabled": true,\n    "count": 42\n  }\n}'
  );
  const [indentSize, setIndentSize] = useState(2);
  const [copied, setCopied] = useState(false);
  const [doMinify, setDoMinify] = useState(false);

  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      const formatted = doMinify
        ? JSON.stringify(parsed)
        : JSON.stringify(parsed, null, indentSize);
      return {
        valid: true as const,
        output: formatted,
        inputSize: input.length,
        outputSize: formatted.length,
        error: null as string | null,
      };
    } catch (e) {
      const msg = (e as Error).message;
      // try to extract line/col from error
      const lineMatch = msg.match(/position\s+(\d+)/);
      let lineInfo = "";
      if (lineMatch) {
        const pos = parseInt(lineMatch[1]);
        const before = input.slice(0, pos);
        const line = before.split("\n").length;
        const col = pos - before.lastIndexOf("\n");
        lineInfo = ` at line ${line}, column ${col}`;
      }
      return {
        valid: false as const,
        output: "",
        inputSize: input.length,
        outputSize: 0,
        error: `${msg}${lineInfo}`,
      };
    }
  }, [input, indentSize, doMinify]);

  async function copyOutput() {
    if (!result.valid || !result.output) return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main>
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="container">
          <p className="eyebrow">Free developer utility</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-normal md:text-5xl">
            JSON Formatter &amp; Validator
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Format, validate, minify, and inspect JSON data instantly — all in your browser.
          </p>
        </div>
      </section>

      <section className="container grid gap-6 py-10 lg:grid-cols-2">
        {/* Left: Input */}
        <div className="grid gap-4 content-start">
          <label className="grid gap-2">
            <span className="text-sm font-bold">Input JSON</span>
            <textarea
              className="min-h-64 rounded-lg border border-slate-300 px-3 py-3 font-mono text-sm leading-relaxed"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Paste your JSON here, e.g. {"key": "value"}'
              spellCheck={false}
            />
          </label>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>Input: {result.inputSize.toLocaleString()} chars</span>
            <span className="text-slate-300">|</span>
            {result.valid && (
              <>
                <span>Output: {result.outputSize.toLocaleString()} chars</span>
                <span className="text-slate-300">|</span>
                <span>
                  Savings:{" "}
                  {result.inputSize > 0
                    ? Math.round(
                        (1 - result.outputSize / result.inputSize) * 100
                      )
                    : 0}
                  %
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Output */}
        <div className="grid gap-4 content-start">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Output</span>
              {result.valid ? (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  Valid JSON
                </span>
              ) : (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                  Invalid
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Indent toggle */}
              <select
                className="rounded-md border border-slate-300 px-2 py-1.5 text-xs font-mono"
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                disabled={doMinify}
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={1}>1 space</option>
              </select>
              {/* Minify toggle */}
              <button
                onClick={() => setDoMinify((v) => !v)}
                className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition ${
                  doMinify
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                Minify
              </button>
              {/* Copy */}
              <button
                onClick={copyOutput}
                disabled={!result.valid}
                className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-300 disabled:opacity-40"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {result.valid ? (
            <div className="rounded-lg border border-slate-200 bg-white">
              <pre className="max-h-80 overflow-auto p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                <code>{result.output}</code>
              </pre>
            </div>
          ) : (
            <div className="rounded-lg border border-red-300 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-red-800">JSON parse error</p>
                  <p className="mt-1 font-mono text-sm text-red-700">{result.error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick stats */}
          {result.valid && (() => {
            const parsed = JSON.parse(input);
            const countLeaves = (val: unknown): number => {
              if (val === null || typeof val !== "object") return 1;
              if (Array.isArray(val)) return val.reduce((s, v) => s + countLeaves(v), 0);
              return Object.values(val).reduce((s, v) => s + countLeaves(v), 0);
            };
            const countKeys = (val: unknown): number => {
              if (val === null || typeof val !== "object") return 0;
              if (Array.isArray(val)) return val.reduce((s, v) => s + countKeys(v), 0);
              return Object.keys(val).length + Object.values(val).reduce((s, v) => s + countKeys(v), 0);
            };
            const isArray = Array.isArray(parsed);
            return (
              <div className="grid grid-cols-3 gap-3 text-center text-xs text-slate-500">
                <div className="rounded-md border border-slate-200 bg-white p-2">
                  <p className="font-bold text-slate-700">{isArray ? parsed.length : countKeys(parsed)}</p>
                  <p>{isArray ? "items" : "keys"}</p>
                </div>
                <div className="rounded-md border border-slate-200 bg-white p-2">
                  <p className="font-bold text-slate-700">{countLeaves(parsed)}</p>
                  <p>values</p>
                </div>
                <div className="rounded-md border border-slate-200 bg-white p-2">
                  <p className="font-bold text-slate-700">{typeof parsed}</p>
                  <p>root type</p>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-10">
        <div className="container">
          <div className="rounded-lg border border-slate-200 bg-[#f7f4ef] p-6">
            <p className="text-sm font-bold">Need help with JSON APIs or data pipelines?</p>
            <p className="mt-2 text-sm text-slate-600">
              If you are building integrations, debugging API responses, or need help
              designing JSON schemas, send us your use case and we will help.
            </p>
            <a
              className="btn mt-4 inline-flex"
              href="mailto:huazai16168@gmail.com?subject=JSON%20help%20request"
            >
              Request JSON help
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
