"use client";

import { useMemo, useState } from "react";

const SQL_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "IN", "IS", "NULL",
  "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE", "CREATE", "TABLE",
  "ALTER", "DROP", "INDEX", "JOIN", "LEFT", "RIGHT", "INNER", "OUTER",
  "FULL", "ON", "AS", "ORDER", "BY", "GROUP", "HAVING", "LIMIT", "OFFSET",
  "UNION", "ALL", "DISTINCT", "CASE", "WHEN", "THEN", "ELSE", "END",
  "ASC", "DESC", "BETWEEN", "LIKE", "EXISTS", "WITH", "RECURSIVE",
  "PRIMARY", "KEY", "FOREIGN", "REFERENCES", "CONSTRAINT", "DEFAULT",
  "CHECK", "UNIQUE", "CASCADE", "TRUNCATE", "BEGIN", "COMMIT", "ROLLBACK",
  "GRANT", "REVOKE", "REPLACE", "MERGE", "IF", "VIEW", "COUNT", "SUM",
  "AVG", "MAX", "MIN", "COALESCE", "CAST", "CONVERT",
];

function formatSQL(sql: string, indentSize: number, uppercase: boolean): string {
  const trimmed = sql.trim();
  if (!trimmed) return "";

  // Tokenize
  const tokens: { type: "keyword" | "text" | "string" | "comment" | "paren" | "comma" | "semicolon" | "ws"; value: string }[] = [];
  let i = 0;
  while (i < trimmed.length) {
    // Whitespace
    if (/\s/.test(trimmed[i])) {
      let ws = "";
      while (i < trimmed.length && /\s/.test(trimmed[i])) {
        ws += trimmed[i];
        i++;
      }
      tokens.push({ type: "ws", value: ws });
      continue;
    }
    // Single-line comment
    if (trimmed[i] === "-" && trimmed[i + 1] === "-") {
      let cmt = "";
      while (i < trimmed.length && trimmed[i] !== "\n") {
        cmt += trimmed[i];
        i++;
      }
      tokens.push({ type: "comment", value: cmt });
      continue;
    }
    // Block comment
    if (trimmed[i] === "/" && trimmed[i + 1] === "*") {
      let cmt = "/*";
      i += 2;
      while (i < trimmed.length - 1 && !(trimmed[i] === "*" && trimmed[i + 1] === "/")) {
        cmt += trimmed[i];
        i++;
      }
      if (i < trimmed.length) {
        cmt += "*/";
        i += 2;
      }
      tokens.push({ type: "comment", value: cmt });
      continue;
    }
    // String literal
    if (trimmed[i] === "'" || trimmed[i] === '"') {
      const quote = trimmed[i];
      let str = quote;
      i++;
      while (i < trimmed.length && trimmed[i] !== quote) {
        if (trimmed[i] === "\\") {
          str += trimmed[i];
          i++;
          if (i < trimmed.length) str += trimmed[i];
        } else {
          str += trimmed[i];
        }
        i++;
      }
      if (i < trimmed.length) {
        str += quote;
        i++;
      }
      tokens.push({ type: "string", value: str });
      continue;
    }
    // Parentheses
    if (trimmed[i] === "(" || trimmed[i] === ")") {
      tokens.push({ type: "paren", value: trimmed[i] });
      i++;
      continue;
    }
    // Comma
    if (trimmed[i] === ",") {
      tokens.push({ type: "comma", value: "," });
      i++;
      continue;
    }
    // Semicolon
    if (trimmed[i] === ";") {
      tokens.push({ type: "semicolon", value: ";" });
      i++;
      continue;
    }
    // Word / identifier / keyword
    let word = "";
    while (i < trimmed.length && /[a-zA-Z0-9_$.]/.test(trimmed[i])) {
      word += trimmed[i];
      i++;
    }
    if (word) {
      const upper = word.toUpperCase();
      if (SQL_KEYWORDS.includes(upper)) {
        tokens.push({ type: "keyword", value: word });
      } else {
        tokens.push({ type: "text", value: word });
      }
      continue;
    }
    // Other single characters
    tokens.push({ type: "text", value: trimmed[i] });
    i++;
  }

  // Format tokens into output
  const indent = " ".repeat(indentSize);
  let level = 0;
  const newlineKeywords = new Set([
    "SELECT", "FROM", "WHERE", "AND", "OR", "INSERT", "INTO", "VALUES",
    "UPDATE", "SET", "DELETE", "CREATE", "ALTER", "DROP", "JOIN",
    "LEFT", "RIGHT", "INNER", "OUTER", "FULL", "ON", "ORDER", "BY",
    "GROUP", "HAVING", "LIMIT", "OFFSET", "UNION", "ALL", "CASE",
    "WHEN", "THEN", "ELSE", "END", "WITH", "BEGIN", "COMMIT", "ROLLBACK",
  ]);
  const indentAfterKeywords = new Set([
    "SELECT", "FROM", "WHERE", "INSERT", "INTO", "UPDATE", "SET",
    "CREATE", "ALTER", "ON", "CASE", "WHEN", "ELSE", "WITH",
    "BEGIN", "VALUES",
  ]);

  let result = "";
  let lastTokenType = "";
  let lineStart = true;
  let parenDepth = 0;

  for (let ti = 0; ti < tokens.length; ti++) {
    const token = tokens[ti];
    const upperVal = token.value.toUpperCase();

    if (token.type === "ws") {
      // Collapse whitespace inside formatted output
      if (lastTokenType !== "" && lastTokenType !== "ws" && lastTokenType !== "comma" && lastTokenType !== "paren") {
        result += " ";
      }
      lineStart = false;
    } else if (token.type === "comment") {
      if (!lineStart) result += " ";
      result += token.value;
      result += "\n";
      result += indent.repeat(level);
      lineStart = true;
    } else if (token.type === "paren") {
      if (token.value === "(") {
        parenDepth++;
        result += "(";
        // Look ahead for subquery
        let nextNonWs = ti + 1;
        while (nextNonWs < tokens.length && tokens[nextNonWs].type === "ws") nextNonWs++;
        if (nextNonWs < tokens.length && tokens[nextNonWs].type === "keyword" && tokens[nextNonWs].value.toUpperCase() === "SELECT") {
          result += "\n";
          level++;
          result += indent.repeat(level);
          lineStart = true;
        }
      } else {
        parenDepth--;
        if (!lineStart) result = result.trimEnd();
        result += ")";
        lineStart = false;
      }
    } else if (token.type === "comma") {
      result += ",";
      result += "\n";
      result += indent.repeat(level);
      lineStart = true;
    } else if (token.type === "semicolon") {
      result += ";";
      result += "\n";
      lineStart = true;
      level = 0;
    } else if (token.type === "keyword") {
      const kw = uppercase ? upperVal : token.value;
      if (!lineStart) {
        if (newlineKeywords.has(upperVal)) {
          result += "\n";
          if (indentAfterKeywords.has(upperVal)) {
            level++;
          }
          if (upperVal === "ELSE" || upperVal === "END") {
            level = Math.max(0, level - 1);
          }
          result += indent.repeat(level);
          lineStart = true;
        } else {
          result += " ";
        }
      }
      result += kw;
      lineStart = false;
      lastTokenType = "keyword";
      continue;
    } else if (token.type === "string") {
      if (!lineStart) result += " ";
      result += token.value;
      lineStart = false;
    } else {
      if (!lineStart) result += " ";
      result += token.value;
      lineStart = false;
    }
    lastTokenType = token.type;
  }

  return result.trim();
}

export default function SqlFormatterPage() {
  const [input, setInput] = useState(
    "select u.id, u.name, o.total from users u inner join orders o on u.id = o.user_id where o.total > 100 and u.active = 1 order by o.total desc limit 10;"
  );
  const [indentSize, setIndentSize] = useState(2);
  const [uppercase, setUppercase] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return { valid: true, output: "", inputSize: 0, outputSize: 0, error: null };
    const formatted = formatSQL(input, indentSize, uppercase);
    // Check for basic SQL validity: should contain at least one keyword
    const hasKeyword = SQL_KEYWORDS.some(
      (kw) => input.toUpperCase().includes(kw)
    );
    return {
      valid: hasKeyword || input.trim().length < 10,
      output: formatted,
      inputSize: input.length,
      outputSize: formatted.length,
      error: hasKeyword ? null : "No SQL keywords detected — this may not be valid SQL.",
    };
  }, [input, indentSize, uppercase]);

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
            SQL Formatter &amp; Beautifier
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Format messy SQL queries with proper indentation, keyword casing, and
            line breaks — instantly in your browser.
          </p>
        </div>
      </section>

      <section className="container grid gap-6 py-10 lg:grid-cols-2">
        {/* Left: Input */}
        <div className="grid gap-4 content-start">
          <label className="grid gap-2">
            <span className="text-sm font-bold">Input SQL</span>
            <textarea
              className="min-h-64 rounded-lg border border-slate-300 px-3 py-3 font-mono text-sm leading-relaxed"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your SQL here, e.g. SELECT * FROM users WHERE id = 1"
              spellCheck={false}
            />
          </label>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>Input: {result.inputSize.toLocaleString()} chars</span>
            <span className="text-slate-300">|</span>
            <span>Output: {result.outputSize.toLocaleString()} chars</span>
          </div>
        </div>

        {/* Right: Output */}
        <div className="grid gap-4 content-start">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Formatted SQL</span>
              {result.valid ? (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  Ready
                </span>
              ) : (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  {result.error}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <select
                className="rounded-md border border-slate-300 px-2 py-1.5 text-xs font-mono"
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={1}>Tab (1)</option>
              </select>
              <button
                onClick={() => setUppercase((v) => !v)}
                className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition ${
                  uppercase
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                UPPER
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

          {result.output ? (
            <div className="rounded-lg border border-slate-200 bg-white">
              <pre className="max-h-80 overflow-auto p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                <code>{result.output}</code>
              </pre>
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-400">
              Paste SQL on the left to see the formatted output here.
            </div>
          )}
        </div>
      </section>

      {/* What is this? */}
      <section className="border-t border-slate-200 bg-white py-10">
        <div className="container prose">
          <h2 className="text-2xl font-black">What is a SQL Formatter?</h2>
          <p className="mt-3 text-slate-600">
            A SQL formatter takes unstructured, hard-to-read SQL queries and
            applies consistent indentation, line breaks, and keyword casing to make
            them readable. It handles SELECT, INSERT, UPDATE, DELETE statements,
            JOINs, subqueries, and nested expressions. This tool runs entirely in
            your browser — no data is sent to any server.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="border-t border-slate-200 bg-white py-10">
        <div className="container prose">
          <h2 className="text-2xl font-black">FAQs</h2>
          <div className="mt-4 grid gap-6">
            <div>
              <h3 className="font-bold">Does this support all SQL dialects?</h3>
              <p className="text-slate-600">
                The formatter works with standard SQL (ANSI). It handles common
                patterns across MySQL, PostgreSQL, SQLite, and SQL Server. Very
                dialect-specific syntax (e.g., Postgres JSON operators) may not
                format perfectly but will still be readable.
              </p>
            </div>
            <div>
              <h3 className="font-bold">Does my SQL leave this page?</h3>
              <p className="text-slate-600">
                No. All formatting happens in your browser using regex-based
                parsing. Your queries never leave your computer.
              </p>
            </div>
            <div>
              <h3 className="font-bold">Can I format multiple statements at once?</h3>
              <p className="text-slate-600">
                Yes. Separate statements with semicolons, and the formatter will
                handle each one independently with proper spacing between them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-white py-10">
        <div className="container">
          <div className="rounded-lg border border-slate-200 bg-[#f7f4ef] p-6">
            <p className="text-sm font-bold">Need help with SQL queries or database optimization?</p>
            <p className="mt-2 text-sm text-slate-600">
              If you are debugging complex queries, optimizing database performance,
              or designing schemas, send us your use case and we will help.
            </p>
            <a
              className="btn mt-4 inline-flex"
              href="mailto:huazai16168@gmail.com?subject=SQL%20help%20request"
            >
              Request SQL help
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
