"use client";

import { useMemo, useState } from "react";
import { generateToolOutput, type Tool } from "@/lib/tools";

export function ToolGenerator({ tool }: { tool: Tool }) {
  const [productName, setProductName] = useState("");
  const [url, setUrl] = useState("");
  const [audience, setAudience] = useState("");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);
  const output = useMemo(
    () => generateToolOutput(tool.slug, { productName, url, audience, notes }),
    [tool.slug, productName, url, audience, notes],
  );

  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <section className="card p-5 md:p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-bold">Product name</span>
          <input
            className="rounded-lg border border-slate-300 px-3 py-3"
            value={productName}
            onChange={(event) => setProductName(event.target.value)}
            placeholder="LaunchAssetKit"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold">URL</span>
          <input
            className="rounded-lg border border-slate-300 px-3 py-3"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold">Audience</span>
          <input
            className="rounded-lg border border-slate-300 px-3 py-3"
            value={audience}
            onChange={(event) => setAudience(event.target.value)}
            placeholder="indie app developers"
          />
        </label>
        <label className="grid gap-2 md:row-span-2">
          <span className="text-sm font-bold">Notes</span>
          <textarea
            className="min-h-32 rounded-lg border border-slate-300 px-3 py-3"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="What are you launching? What problem does it solve?"
          />
        </label>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button className="btn" type="button" onClick={copyOutput}>
          {copied ? "Copied" : "Copy result"}
        </button>
        <a
          className="btn secondary"
          href={`mailto:huazai16168@gmail.com?subject=${encodeURIComponent(tool.cta)}`}
        >
          {tool.cta}
        </a>
      </div>
      <div className="mt-6 rounded-lg border border-slate-300 bg-slate-950 p-4 text-sm text-slate-50">
        <div className="tool-output">{output}</div>
      </div>
    </section>
  );
}
