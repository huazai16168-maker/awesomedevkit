"use client";

import { useMemo, useState } from "react";

function flattenObject(
  obj: Record<string, unknown>,
  prefix = ""
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value === null || value === undefined) {
      result[fullKey] = "";
    } else if (typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, fullKey));
    } else if (Array.isArray(value)) {
      result[fullKey] = JSON.stringify(value);
    } else {
      result[fullKey] = String(value);
    }
  }
  return result;
}

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n") || value.includes("\r")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function jsonToCSV(jsonText: string): {
  valid: boolean;
  output: string;
  error: string | null;
  rowCount: number;
  colCount: number;
  inputSize: number;
  outputSize: number;
} {
  const trimmed = jsonText.trim();
  if (!trimmed) {
    return {
      valid: true, output: "", error: null, rowCount: 0, colCount: 0,
      inputSize: 0, outputSize: 0,
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch (e) {
    const msg = (e as Error).message;
    const lineMatch = msg.match(/position\s+(\d+)/);
    let lineInfo = "";
    if (lineMatch) {
      const pos = parseInt(lineMatch[1]);
      const before = trimmed.slice(0, pos);
      const line = before.split("\n").length;
      const col = pos - before.lastIndexOf("\n");
      lineInfo = ` at line ${line}, column ${col}`;
    }
    return {
      valid: false, output: "", error: `${msg}${lineInfo}`,
      rowCount: 0, colCount: 0,
      inputSize: trimmed.length, outputSize: 0,
    };
  }

  // Must be an array
  if (!Array.isArray(parsed)) {
    return {
      valid: false,
      output: "",
      error: "Input must be a JSON array. Wrap your objects in [...] brackets.",
      rowCount: 0, colCount: 0,
      inputSize: trimmed.length, outputSize: 0,
    };
  }

  if (parsed.length === 0) {
    return {
      valid: true,
      output: "",
      error: null,
      rowCount: 0, colCount: 0,
      inputSize: trimmed.length, outputSize: 0,
    };
  }

  // Check that array items are objects
  if (typeof parsed[0] !== "object" || parsed[0] === null) {
    // Simple array — single column
    const headers = ["value"];
    const rows = parsed.map((item) => [String(item)]);
    const csvLines = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ];
    const csv = csvLines.join("\n");
    return {
      valid: true, output: csv, error: null,
      rowCount: rows.length, colCount: headers.length,
      inputSize: trimmed.length, outputSize: csv.length,
    };
  }

  // Object array — extract headers from first item
  const firstFlat = flattenObject(parsed[0] as Record<string, unknown>);
  const headers = Object.keys(firstFlat);

  // Flatten all rows
  const rows = parsed.map((item) => {
    if (typeof item !== "object" || item === null) return {};
    return flattenObject(item as Record<string, unknown>);
  });

  const csvLines = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => headers.map((h) => escapeCSV(row[h] ?? "")).join(",")),
  ];
  const csv = csvLines.join("\n");

  return {
    valid: true, output: csv, error: null,
    rowCount: rows.length, colCount: headers.length,
    inputSize: trimmed.length, outputSize: csv.length,
  };
}

export default function JsonToCsvPage() {
  const [input, setInput] = useState(
    `[
  {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "address": {
      "city": "New York",
      "zip": "10001"
    }
  },
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "age": 28,
    "address": {
      "city": "San Francisco",
      "zip": "94105"
    }
  },
  {
    "name": "Bob Johnson",
    "email": "bob@example.com",
    "age": 35,
    "address": {
      "city": "Chicago",
      "zip": "60601"
    }
  }
]`
  );
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => jsonToCSV(input), [input]);

  async function copyOutput() {
    if (!result.output) return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  function downloadCSV() {
    if (!result.output) return;
    const blob = new Blob([result.output], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main>
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="container">
          <p className="eyebrow">Free developer utility</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-normal md:text-5xl">
            JSON to CSV Converter
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Convert JSON arrays to CSV format instantly — auto-detect headers,
            flatten nested objects, and download as .csv file.
          </p>
        </div>
      </section>

      <section className="container grid gap-6 py-10 lg:grid-cols-2">
        {/* Left: Input */}
        <div className="grid gap-4 content-start">
          <label className="grid gap-2">
            <span className="text-sm font-bold">Input JSON Array</span>
            <textarea
              className="min-h-64 rounded-lg border border-slate-300 px-3 py-3 font-mono text-sm leading-relaxed"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Paste your JSON array here, e.g. [{"key": "value"}]'
              spellCheck={false}
            />
          </label>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>Input: {result.inputSize.toLocaleString()} chars</span>
            {result.valid && result.output && (
              <>
                <span className="text-slate-300">|</span>
                <span>Output: {result.outputSize.toLocaleString()} chars</span>
                <span className="text-slate-300">|</span>
                <span>
                  {result.rowCount} row{result.rowCount !== 1 ? "s" : ""},{" "}
                  {result.colCount} col{result.colCount !== 1 ? "s" : ""}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Output */}
        <div className="grid gap-4 content-start">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">CSV Output</span>
              {result.valid ? (
                result.output ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    Ready
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                    Empty
                  </span>
                )
              ) : (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                  Invalid JSON
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={copyOutput}
                disabled={!result.output}
                className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-300 disabled:opacity-40"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={downloadCSV}
                disabled={!result.output}
                className="rounded-md border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-40"
              >
                Download .csv
              </button>
            </div>
          </div>

          {result.valid ? (
            result.output ? (
              <div className="rounded-lg border border-slate-200 bg-white">
                <pre className="max-h-80 overflow-auto p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  <code>{result.output}</code>
                </pre>
              </div>
            ) : (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-400">
                Paste a JSON array on the left to see the CSV output here.
              </div>
            )
          ) : (
            <div className="rounded-lg border border-red-300 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-red-800">JSON parse error</p>
                  <p className="mt-1 font-mono text-sm text-red-700">
                    {result.error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick stats */}
          {result.valid && result.output && (
            <div className="grid grid-cols-3 gap-3 text-center text-xs text-slate-500">
              <div className="rounded-md border border-slate-200 bg-white p-2">
                <p className="font-bold text-slate-700">{result.rowCount}</p>
                <p>data rows</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-white p-2">
                <p className="font-bold text-slate-700">{result.colCount}</p>
                <p>columns</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-white p-2">
                <p className="font-bold text-slate-700">
                  {result.colCount > 0 ? `${result.colCount} col${result.colCount > 1 ? "s" : ""}` : "N/A"}
                </p>
                <p>CSV format</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* What is this? */}
      <section className="border-t border-slate-200 bg-white py-10">
        <div className="container prose">
          <h2 className="text-2xl font-black">
            What is a JSON to CSV Converter?
          </h2>
          <p className="mt-3 text-slate-600">
            A JSON to CSV converter transforms JSON data (typically an array of
            objects) into CSV (Comma-Separated Values) format. This is useful
            when you need to open JSON data in Excel, Google Sheets, or any
            spreadsheet application. The tool auto-detects column headers from
            the first object&apos;s keys, flattens nested objects (e.g.,{" "}
            <code>address.city</code> becomes <code>address.city</code>), and
            handles special characters with proper CSV escaping. All processing
            happens in your browser.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="border-t border-slate-200 bg-white py-10">
        <div className="container prose">
          <h2 className="text-2xl font-black">FAQs</h2>
          <div className="mt-4 grid gap-6">
            <div>
              <h3 className="font-bold">
                What happens to nested objects and arrays?
              </h3>
              <p className="text-slate-600">
                Nested objects are flattened with dot notation — e.g.,{" "}
                <code>{`{"address": {"city": "NY"}}`}</code> becomes a column
                named <code>address.city</code>. Arrays inside objects are
                converted to their JSON string representation.
              </p>
            </div>
            <div>
              <h3 className="font-bold">Does this work with large datasets?</h3>
              <p className="text-slate-600">
                The tool handles typical datasets of a few thousand rows. For
                very large JSON files (100K+ rows), consider command-line tools
                like <code>jq</code> or <code>csvkit</code>.
              </p>
            </div>
            <div>
              <h3 className="font-bold">Can I convert JSON with different keys per object?</h3>
              <p className="text-slate-600">
                Yes. The tool uses the first object in the array to detect
                column headers. Objects with additional keys will have those
                values appear under their respective columns, and missing keys
                will show as empty cells.
              </p>
            </div>
            <div>
              <h3 className="font-bold">Does my data leave this page?</h3>
              <p className="text-slate-600">
                No. All conversion happens in your browser. Your JSON data never
                leaves your computer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-white py-10">
        <div className="container">
          <div className="rounded-lg border border-slate-200 bg-[#f7f4ef] p-6">
            <p className="text-sm font-bold">
              Need help with data processing or API integration?
            </p>
            <p className="mt-2 text-sm text-slate-600">
              If you are building data pipelines, transforming API responses, or
              migrating data between formats, send us your use case and we will
              help.
            </p>
            <a
              className="btn mt-4 inline-flex"
              href="mailto:huazai16168@gmail.com?subject=Data%20processing%20help"
            >
              Request data help
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
