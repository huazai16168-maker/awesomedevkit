"use client";

import { useMemo, useState } from "react";

// Minimal YAML parser — handles the most common YAML subset
function parseYaml(text: string): unknown {
  // This is a simplified parser; for production use, a library like js-yaml is recommended.
  // It handles: key-value pairs, nested objects (indentation-based), arrays (dash lists),
  // strings (quoted and unquoted), numbers, booleans, null, and comments.

  const lines = text.split("\n");
  let i = 0;
  const errors: { line: number; col: number; msg: string }[] = [];

  function peek(): string | null {
    while (i < lines.length && lines[i].trim() === "") i++;
    if (i >= lines.length) return null;
    return lines[i];
  }

  function getIndent(line: string): number {
    const match = line.match(/^(\s*)/);
    return match ? match[0].length : 0;
  }

  function skipBlanks() {
    while (i < lines.length) {
      const trimmed = lines[i].trim();
      if (trimmed === "" || trimmed.startsWith("#")) {
        i++;
        continue;
      }
      break;
    }
  }

  function parseValue(val: string): unknown {
    const trimmed = val.trim();
    // Null
    if (trimmed === "null" || trimmed === "~" || trimmed === "") return null;
    // Booleans
    if (trimmed === "true" || trimmed === "True" || trimmed === "TRUE") return true;
    if (trimmed === "false" || trimmed === "False" || trimmed === "FALSE") return false;
    // Numbers
    if (/^-?\d+\.\d+$/.test(trimmed)) return parseFloat(trimmed);
    if (/^-?\d+$/.test(trimmed)) return parseInt(trimmed, 10);
    // Quoted strings
    if (
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
      return trimmed.slice(1, -1);
    }
    // Plain string
    return trimmed;
  }

  function parseBlock(baseIndent: number): unknown {
    skipBlanks();
    if (i >= lines.length) return {};

    const line = lines[i];
    const indent = getIndent(line);
    if (indent < baseIndent) return {};

    const trimmed = line.trim();

    // Array item
    if (trimmed.startsWith("- ")) {
      const result: unknown[] = [];
      while (i < lines.length) {
        skipBlanks();
        if (i >= lines.length) break;
        const ln = lines[i];
        const currentIndent = getIndent(ln);
        if (currentIndent < baseIndent) break;

        const t = ln.trim();
        if (!t.startsWith("- ")) {
          errors.push({ line: i + 1, col: currentIndent + 1, msg: "Expected '-' for array item" });
          i++;
          continue;
        }

        const itemVal = t.slice(2);
        // Check if next lines are indented more (nested object/array)
        const nextLine = i + 1 < lines.length ? lines[i + 1] : "";
        const nextIndent = getIndent(nextLine);
        const nextTrimmed = nextLine.trim();
        if (nextLine && nextIndent > currentIndent && !nextTrimmed.startsWith("- ") && !nextTrimmed.startsWith("#")) {
          // Nested object
          i++;
          const nested = parseBlock(nextIndent);
          result.push(nested);
        } else if (itemVal.trim() === "") {
          // Empty dash, look for nested content
          if (nextLine && nextIndent > currentIndent) {
            i++;
            const nested = parseBlock(nextIndent);
            result.push(nested);
          } else {
            i++;
            result.push(null);
          }
        } else {
          i++;
          result.push(parseValue(itemVal));
        }
      }
      return result;
    }

    // Object (key-value pairs)
    const result: Record<string, unknown> = {};
    while (i < lines.length) {
      skipBlanks();
      if (i >= lines.length) break;
      const ln = lines[i];
      const currentIndent = getIndent(ln);
      if (currentIndent < baseIndent) break;
      if (currentIndent > baseIndent) {
        // This is an indented value for the previous key
        break;
      }

      const t = ln.trim();
      if (t === "" || t.startsWith("#")) {
        i++;
        continue;
      }

      const colonIdx = t.indexOf(":");
      if (colonIdx === -1) {
        errors.push({ line: i + 1, col: 1, msg: "Expected 'key: value' pair" });
        i++;
        continue;
      }

      const key = t.slice(0, colonIdx).trim();
      const afterColon = t.slice(colonIdx + 1);

      // Check for empty value — might be a nested object
      if (afterColon.trim() === "") {
        // Look ahead for indented content
        const nextLine = i + 1 < lines.length ? lines[i + 1] : "";
        const nextIndent = getIndent(nextLine);
        const nextTrimmed = nextLine.trim();
        if (nextLine && nextIndent > baseIndent && !nextTrimmed.startsWith("#") && nextTrimmed !== "") {
          i++;
          const nested = parseBlock(nextIndent);
          // If array or object was parsed
          if (nested !== undefined) {
            result[key] = nested;
            continue;
          }
        }
        // Empty key with no nested content = null
        i++;
        result[key] = null;
        continue;
      }

      // Inline value (or inline array/object)
      const valStr = afterColon.trim();
      if (valStr.startsWith("[") && valStr.endsWith("]")) {
        // Inline array
        const inner = valStr.slice(1, -1);
        if (inner.trim() === "") {
          result[key] = [];
        } else {
          result[key] = inner.split(",").map((s) => parseValue(s.trim()));
        }
      } else if (valStr.startsWith("{") && valStr.endsWith("}")) {
        // Inline object — simplified
        const inner = valStr.slice(1, -1);
        const obj: Record<string, unknown> = {};
        if (inner.trim() !== "") {
          inner.split(",").forEach((pair) => {
            const pColon = pair.indexOf(":");
            if (pColon > 0) {
              obj[pair.slice(0, pColon).trim()] = parseValue(pair.slice(pColon + 1).trim());
            }
          });
        }
        result[key] = obj;
      } else {
        result[key] = parseValue(valStr);
      }
      i++;
    }
    return result;
  }

  const parsed = parseBlock(0);
  if (errors.length > 0) {
    throw new Error(errors.map((e) => `Line ${e.line}: ${e.msg}`).join("; "));
  }
  return parsed;
}

export default function YamlValidatorPage() {
  const [input, setInput] = useState(
    `name: AwesomeDevKit
version: "1.0.0"
tools:
  - name: JSON Formatter
    type: dev
    active: true
  - name: Regex Tester
    type: dev
    active: true
settings:
  theme: dark
  notifications: false
  max_items: 100`
  );
  const [convertToJson, setConvertToJson] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) {
      return {
        valid: true,
        output: "",
        inputSize: 0,
        outputSize: 0,
        error: null,
      };
    }

    try {
      const parsed = parseYaml(input);
      const json = JSON.stringify(parsed, null, 2);
      return {
        valid: true as const,
        output: convertToJson ? json : JSON.stringify(parsed, null, 2),
        rawJson: json,
        inputSize: input.length,
        outputSize: convertToJson ? json.length : input.length,
        error: null as string | null,
      };
    } catch (e) {
      return {
        valid: false as const,
        output: "",
        rawJson: "",
        inputSize: input.length,
        outputSize: 0,
        error: (e as Error).message,
      };
    }
  }, [input, convertToJson]);

  async function copyOutput() {
    if (!result.output) return;
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
            YAML Validator &amp; JSON Converter
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Validate YAML syntax, catch errors with line numbers, and convert
            valid YAML to JSON — entirely in your browser.
          </p>
        </div>
      </section>

      <section className="container grid gap-6 py-10 lg:grid-cols-2">
        {/* Left: Input */}
        <div className="grid gap-4 content-start">
          <label className="grid gap-2">
            <span className="text-sm font-bold">Input YAML</span>
            <textarea
              className="min-h-64 rounded-lg border border-slate-300 px-3 py-3 font-mono text-sm leading-relaxed"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your YAML here, e.g. key: value"
              spellCheck={false}
            />
          </label>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>Input: {result.inputSize.toLocaleString()} chars</span>
            {result.valid && result.output && result.rawJson && (
              <>
                <span className="text-slate-300">|</span>
                <span>
                  JSON size: {result.rawJson.toLocaleString()} chars
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Output */}
        <div className="grid gap-4 content-start">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">
                {convertToJson ? "JSON Output" : "YAML Output"}
              </span>
              {result.valid ? (
                result.output ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    Valid YAML
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                    Empty
                  </span>
                )
              ) : (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                  Invalid
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setConvertToJson((v) => !v)}
                disabled={!result.valid}
                className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition disabled:opacity-40 ${
                  convertToJson
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                Show JSON
              </button>
              <button
                onClick={copyOutput}
                disabled={!result.output}
                className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-300 disabled:opacity-40"
              >
                {copied ? "Copied!" : "Copy"}
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
                Paste YAML on the left to see the output here.
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
                  <p className="font-semibold text-red-800">YAML parse error</p>
                  <p className="mt-1 font-mono text-sm text-red-700">
                    {result.error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* YAML type stats */}
          {result.valid && result.output && (() => {
            try {
              const parsed = parseYaml(input);
              const isArray = Array.isArray(parsed);
              const countKeys = (obj: unknown): number => {
                if (obj === null || typeof obj !== "object") return 0;
                if (Array.isArray(obj)) return obj.length + obj.reduce((s, v) => s + countKeys(v), 0);
                return Object.keys(obj).length + Object.values(obj).reduce((s, v) => s + countKeys(v), 0);
              };
              return (
                <div className="grid grid-cols-3 gap-3 text-center text-xs text-slate-500">
                  <div className="rounded-md border border-slate-200 bg-white p-2">
                    <p className="font-bold text-slate-700">
                      {isArray ? (parsed as unknown[]).length : countKeys(parsed)}
                    </p>
                    <p>{isArray ? "items" : "keys"}</p>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white p-2">
                    <p className="font-bold text-slate-700">{isArray ? "array" : typeof parsed}</p>
                    <p>root type</p>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white p-2">
                    <p className="font-bold text-slate-700">{input.split("\n").filter(l => l.trim() !== "").length}</p>
                    <p>lines</p>
                  </div>
                </div>
              );
            } catch {
              return null;
            }
          })()}
        </div>
      </section>

      {/* What is this? */}
      <section className="border-t border-slate-200 bg-white py-10">
        <div className="container prose">
          <h2 className="text-2xl font-black">What is a YAML Validator?</h2>
          <p className="mt-3 text-slate-600">
            A YAML validator checks whether your YAML (YAML Ain&apos;t Markup
            Language) syntax is correct. YAML is used extensively in
            configuration files (Docker Compose, Kubernetes, CI/CD pipelines,
            Ansible), and a single indentation error can break an entire
            deployment. This tool parses your YAML, catches syntax errors with
            line-level detail, and can convert valid YAML to JSON. All
            processing happens in your browser.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="border-t border-slate-200 bg-white py-10">
        <div className="container prose">
          <h2 className="text-2xl font-black">FAQs</h2>
          <div className="mt-4 grid gap-6">
            <div>
              <h3 className="font-bold">What YAML features are supported?</h3>
              <p className="text-slate-600">
                This tool handles the most common YAML subset: key-value pairs,
                nested objects, arrays (dash lists), inline arrays/objects,
                strings (quoted and unquoted), numbers, booleans, null, and
                comments. Advanced features like anchors (&amp;) and aliases (*)
                are not supported.
              </p>
            </div>
            <div>
              <h3 className="font-bold">Does my YAML leave this page?</h3>
              <p className="text-slate-600">
                No. All parsing happens in your browser. Your YAML data, which
                often contains configuration secrets, never leaves your computer.
              </p>
            </div>
            <div>
              <h3 className="font-bold">Why convert YAML to JSON?</h3>
              <p className="text-slate-600">
                JSON is more widely supported across programming languages and
                APIs. Converting YAML to JSON lets you use the same
                configuration data in environments that only accept JSON, or
                inspect the parsed structure without YAML&apos;s indentation
                ambiguity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-white py-10">
        <div className="container">
          <div className="rounded-lg border border-slate-200 bg-[#f7f4ef] p-6">
            <p className="text-sm font-bold">Need help with YAML or DevOps configs?</p>
            <p className="mt-2 text-sm text-slate-600">
              If you are debugging CI/CD pipelines, Docker Compose files, or
              Kubernetes manifests, send us your use case and we will help.
            </p>
            <a
              className="btn mt-4 inline-flex"
              href="mailto:huazai16168@gmail.com?subject=YAML%20help%20request"
            >
              Request DevOps help
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
