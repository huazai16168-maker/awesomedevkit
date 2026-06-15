"use client";

import { useState, useCallback } from "react";

type Tab = "base64" | "url" | "html";

export default function Base64EncoderPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [tab, setTab] = useState<Tab>("base64");

  const process = useCallback(() => {
    try {
      if (tab === "base64") {
        if (mode === "encode") {
          setOutput(btoa(unescape(encodeURIComponent(input))));
        } else {
          setOutput(decodeURIComponent(escape(atob(input))));
        }
      } else if (tab === "url") {
        if (mode === "encode") {
          setOutput(encodeURIComponent(input));
        } else {
          setOutput(decodeURIComponent(input));
        }
      } else if (tab === "html") {
        if (mode === "encode") {
          const div = document.createElement("div");
          div.appendChild(document.createTextNode(input));
          setOutput(div.innerHTML);
        } else {
          const div = document.createElement("div");
          div.innerHTML = input;
          setOutput(div.textContent || "");
        }
      }
    } catch {
      setOutput("Error: Invalid input. Check your text and try again.");
    }
  }, [input, mode, tab]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "base64", label: "Base64" },
    { key: "url", label: "URL" },
    { key: "html", label: "HTML" },
  ];

  return (
    <main>
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="container">
          <p className="eyebrow">Free developer utility — no data leaves your browser</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-normal md:text-5xl">
            Base64, URL & HTML Encoder / Decoder
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Encode and decode Base64 strings, URL-encode query parameters, and escape HTML entities — all in your browser.
          </p>
        </div>
      </section>

      <section className="container grid gap-6 py-10">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1 w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                tab === t.key ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="radio"
              name="mode"
              checked={mode === "encode"}
              onChange={() => setMode("encode")}
              className="accent-indigo-600"
            />
            Encode
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="radio"
              name="mode"
              checked={mode === "decode"}
              onChange={() => setMode("decode")}
              className="accent-indigo-600"
            />
            Decode
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-bold">
              {mode === "encode" ? "Plain text" : `${tab === "base64" ? "Base64" : tab === "url" ? "URL-encoded" : "HTML-encoded"} text`}
            </span>
            <textarea
              className="min-h-48 rounded-lg border border-slate-300 px-3 py-3 font-mono text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "encode" ? "Enter text to encode..." : "Enter text to decode..."}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold">
              {mode === "encode" ? `${tab === "base64" ? "Base64" : tab === "url" ? "URL-encoded" : "HTML-encoded"} output` : "Plain text output"}
            </span>
            <textarea
              className="min-h-48 rounded-lg border border-slate-300 px-3 py-3 font-mono text-sm bg-slate-50"
              value={output}
              readOnly
              placeholder="Result will appear here..."
            />
            {output && (
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="mt-1 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 w-fit"
              >
                Copy to clipboard
              </button>
            )}
          </label>
        </div>

        <button
          onClick={process}
          className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 w-fit"
        >
          {mode === "encode" ? "Encode" : "Decode"}
        </button>
      </section>

      <section className="border-t border-slate-200 bg-white py-10">
        <div className="container">
          <div className="rounded-lg border border-slate-200 bg-[#f7f4ef] p-6">
            <p className="text-sm font-bold">Need encoding tools for your app or API?</p>
            <p className="mt-2 text-sm text-slate-600">
              If Base64, URL, or HTML encoding is a bottleneck in your workflow, reach out.
            </p>
            <a
              className="btn mt-4 inline-flex"
              href="mailto:huazai16168@gmail.com?subject=Encoding%20help%20request"
            >
              Get help
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
