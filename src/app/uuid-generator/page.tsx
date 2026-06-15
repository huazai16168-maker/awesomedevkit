"use client";

import { useState, useCallback } from "react";

type IdType = "uuid" | "ulid";

function generateUUIDv4(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  let uuid = "";
  for (let i = 0; i < 16; i++) {
    if (i === 4 || i === 6 || i === 8 || i === 10) uuid += "-";
    uuid += bytes[i].toString(16).padStart(2, "0");
  }
  return uuid;
}

function generateULID(): string {
  const time = Date.now().toString(36).padStart(10, "0").toUpperCase();
  const rand = new Uint8Array(16);
  crypto.getRandomValues(rand);
  const encoding = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  let random = "";
  for (let i = 0; i < 16; i++) {
    random += encoding[rand[i] % 32];
  }
  return time + random;
}

export default function UUIDGeneratorPage() {
  const [idType, setIdType] = useState<IdType>("uuid");
  const [count, setCount] = useState(1);
  const [ids, setIds] = useState<string[]>([]);

  const generate = useCallback(() => {
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      results.push(idType === "uuid" ? generateUUIDv4() : generateULID());
    }
    setIds(results);
  }, [count, idType]);

  const copyAll = () => {
    navigator.clipboard.writeText(ids.join("\n"));
  };

  const copyOne = (id: string) => {
    navigator.clipboard.writeText(id);
  };

  return (
    <main>
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="container">
          <p className="eyebrow">Free developer utility — crypto.randomUUID() quality</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-normal md:text-5xl">
            UUID & ULID Generator
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Generate UUIDs (v4) and ULIDs instantly. Cryptographically strong randomness. Batch generate up to 100 at once.
          </p>
        </div>
      </section>

      <section className="container grid gap-8 py-10">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1">
            <button
              onClick={() => setIdType("uuid")}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                idType === "uuid" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              UUID v4
            </button>
            <button
              onClick={() => setIdType("ulid")}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                idType === "ulid" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              ULID
            </button>
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold">
            Count:
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="rounded-md border border-slate-300 px-2 py-1.5"
            >
              {[1, 5, 10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <button
            onClick={generate}
            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700"
          >
            Generate
          </button>
        </div>

        {ids.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold">
                {ids.length} {idType.toUpperCase()}{ids.length > 1 ? "s" : ""} generated
              </p>
              <button
                onClick={copyAll}
                className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Copy all
              </button>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white divide-y divide-slate-100 font-mono text-sm">
              {ids.map((id, i) => (
                <div
                  key={i}
                  onClick={() => copyOne(id)}
                  className="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-slate-50 group"
                >
                  <span className="select-all">{id}</span>
                  <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to copy
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {ids.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <p className="text-slate-400">Click "Generate" to create your first {idType.toUpperCase()}</p>
          </div>
        )}
      </section>

      <section className="border-t border-slate-200 bg-white py-10">
        <div className="container grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-5">
            <p className="text-sm font-bold">UUID v4</p>
            <p className="mt-2 text-sm text-slate-600">
              RFC 4122 compliant. 122 bits of randomness. Format: <code className="font-mono">xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</code>
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-5">
            <p className="text-sm font-bold">ULID</p>
            <p className="mt-2 text-sm text-slate-600">
              Time-sortable identifier. 48-bit timestamp + 80-bit randomness. 26 characters, Crockford Base32 encoded.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
