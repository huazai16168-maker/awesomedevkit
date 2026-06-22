"use client";

import { useMemo, useState } from "react";

interface DecodedJwt {
  header: unknown;
  payload: unknown;
  signature: string;
  headerRaw: string;
  payloadRaw: string;
  error: string | null;
  expiresAt: Date | null;
  issuedAt: Date | null;
  isExpired: boolean;
}

function base64UrlDecode(str: string): string {
  // Replace URL-safe chars and add padding
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  try {
    const decoded = atob(base64);
    // Handle UTF-8
    try {
      return decodeURIComponent(
        decoded
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    } catch {
      return decoded;
    }
  } catch {
    throw new Error("Invalid base64 encoding");
  }
}

function decodeJwt(token: string): DecodedJwt {
  const trimmed = token.trim();

  if (!trimmed) {
    return {
      header: null, payload: null, signature: "",
      headerRaw: "", payloadRaw: "",
      error: "Please enter a JWT token.",
      expiresAt: null, issuedAt: null, isExpired: false,
    };
  }

  // Remove "Bearer " prefix if present
  const cleaned = trimmed.replace(/^Bearer\s+/i, "");

  const parts = cleaned.split(".");
  if (parts.length !== 3) {
    return {
      header: null, payload: null, signature: "",
      headerRaw: "", payloadRaw: "",
      error: "Invalid JWT format. A JWT must have 3 parts separated by dots (header.payload.signature).",
      expiresAt: null, issuedAt: null, isExpired: false,
    };
  }

  try {
    const headerRaw = base64UrlDecode(parts[0]);
    const payloadRaw = base64UrlDecode(parts[1]);
    let header: unknown;
    let payload: unknown;

    try { header = JSON.parse(headerRaw); } catch {
      return { header: null, payload: null, signature: parts[2], headerRaw, payloadRaw,
        error: "Header is not valid JSON.", expiresAt: null, issuedAt: null, isExpired: false };
    }
    try { payload = JSON.parse(payloadRaw); } catch {
      return { header: null, payload: null, signature: parts[2], headerRaw, payloadRaw,
        error: "Payload is not valid JSON.", expiresAt: null, issuedAt: null, isExpired: false };
    }

    // Extract timestamps
    const exp = (payload as Record<string, unknown>)?.exp;
    const iat = (payload as Record<string, unknown>)?.iat;
    let expiresAt: Date | null = null;
    let issuedAt: Date | null = null;
    let isExpired = false;

    if (typeof exp === "number") {
      expiresAt = new Date(exp * 1000);
      isExpired = expiresAt.getTime() < Date.now();
    }
    if (typeof iat === "number") {
      issuedAt = new Date(iat * 1000);
    }

    return {
      header, payload, signature: parts[2],
      headerRaw, payloadRaw,
      error: null,
      expiresAt, issuedAt, isExpired,
    };
  } catch (e) {
    return {
      header: null, payload: null, signature: parts[2],
      headerRaw: "", payloadRaw: "",
      error: `Decode error: ${(e as Error).message}`,
      expiresAt: null, issuedAt: null, isExpired: false,
    };
  }
}

export default function JwtDecoderPage() {
  const [input, setInput] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  );
  const [copiedHeader, setCopiedHeader] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const result = useMemo(() => decodeJwt(input), [input]);

  const parts = input.trim().replace(/^Bearer\s+/i, "").split(".");

  async function copyText(text: string, setter: (v: boolean) => void) {
    await navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 1400);
  }

  return (
    <main>
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="container">
          <p className="eyebrow">Free developer utility</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-normal md:text-5xl">
            JWT Decoder
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Decode and inspect JWT tokens instantly — view header, payload,
            signature, and check expiration — all in your browser.
          </p>
        </div>
      </section>

      <section className="container grid gap-6 py-10 lg:grid-cols-2">
        {/* Left: Input */}
        <div className="grid gap-4 content-start">
          <label className="grid gap-2">
            <span className="text-sm font-bold">JWT Token</span>
            <textarea
              className="min-h-48 rounded-lg border border-slate-300 px-3 py-3 font-mono text-xs leading-relaxed break-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JWT token here (e.g. eyJhbGci...)"
              spellCheck={false}
            />
          </label>

          {/* Token structure visualization */}
          {parts.length === 3 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold text-slate-500 mb-2">Token Structure</p>
              <div className="grid gap-1 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-red-100 px-2 py-0.5 text-red-700 font-bold">Header</span>
                  <span className="text-slate-400 truncate">{parts[0].slice(0, 30)}...</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-purple-100 px-2 py-0.5 text-purple-700 font-bold">Payload</span>
                  <span className="text-slate-400 truncate">{parts[1].slice(0, 30)}...</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-blue-700 font-bold">Signature</span>
                  <span className="text-slate-400 truncate">{parts[2].slice(0, 30)}...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Output */}
        <div className="grid gap-4 content-start">
          {result.error ? (
            <div className="rounded-lg border border-red-300 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-red-800">Invalid JWT</p>
                  <p className="mt-1 font-mono text-sm text-red-700">{result.error}</p>
                </div>
              </div>
            </div>
          ) : result.header ? (
            <>
              {/* Header */}
              <div className="rounded-lg border border-red-200 bg-white">
                <div className="flex items-center justify-between border-b border-red-100 px-4 py-2 bg-red-50 rounded-t-lg">
                  <span className="text-sm font-bold text-red-700">Header</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{JSON.stringify(result.header).length} chars</span>
                    <button
                      onClick={() => copyText(JSON.stringify(result.header, null, 2), setCopiedHeader)}
                      className="rounded border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-600 hover:border-slate-300"
                    >
                      {copiedHeader ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
                <pre className="max-h-40 overflow-auto p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                  <code>{JSON.stringify(result.header, null, 2)}</code>
                </pre>
              </div>

              {/* Payload */}
              <div className="rounded-lg border border-purple-200 bg-white">
                <div className="flex items-center justify-between border-b border-purple-100 px-4 py-2 bg-purple-50 rounded-t-lg">
                  <span className="text-sm font-bold text-purple-700">Payload</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{JSON.stringify(result.payload).length} chars</span>
                    <button
                      onClick={() => copyText(JSON.stringify(result.payload, null, 2), setCopiedPayload)}
                      className="rounded border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-600 hover:border-slate-300"
                    >
                      {copiedPayload ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
                <pre className="max-h-48 overflow-auto p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                  <code>{JSON.stringify(result.payload, null, 2)}</code>
                </pre>
              </div>

              {/* Timestamps */}
              {(result.expiresAt || result.issuedAt) && (
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-sm font-bold mb-2">Timestamps</p>
                  <div className="grid gap-2 text-sm">
                    {result.issuedAt && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Issued at:</span>
                        <span className="font-mono">{result.issuedAt.toLocaleString()}</span>
                      </div>
                    )}
                    {result.expiresAt && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Expires at:</span>
                        <span className="font-mono">{result.expiresAt.toLocaleString()}</span>
                        {result.isExpired ? (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                            EXPIRED
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                            VALID
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Signature note */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-bold text-blue-700">Signature</p>
                <p className="mt-1 font-mono text-xs text-blue-600 break-all">{result.signature}</p>
                <p className="mt-2 text-xs text-blue-500">
                  The signature is used to verify the token&apos;s authenticity. It
                  cannot be decoded without the secret key, which is held by the
                  token issuer.
                </p>
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-400">
              Paste a JWT token on the left to decode it here.
            </div>
          )}
        </div>
      </section>

      {/* What is this? */}
      <section className="border-t border-slate-200 bg-white py-10">
        <div className="container prose">
          <h2 className="text-2xl font-black">What is a JWT Decoder?</h2>
          <p className="mt-3 text-slate-600">
            A JWT (JSON Web Token) decoder extracts and displays the header,
            payload, and signature from a JWT string. JWTs are used for
            authentication and information exchange in web applications. The
            header contains the algorithm and token type, the payload contains
            claims (user data, expiration, etc.), and the signature verifies
            authenticity. This tool decodes the base64url-encoded parts so you can
            inspect the contents without needing the secret key.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="border-t border-slate-200 bg-white py-10">
        <div className="container prose">
          <h2 className="text-2xl font-black">FAQs</h2>
          <div className="mt-4 grid gap-6">
            <div>
              <h3 className="font-bold">Is it safe to paste my JWT here?</h3>
              <p className="text-slate-600">
                Yes. All decoding happens in your browser. Your token never leaves
                your computer. However, avoid pasting tokens into any online tool
                you do not trust — JWTs often contain sensitive user data.
              </p>
            </div>
            <div>
              <h3 className="font-bold">Can this tool verify the signature?</h3>
              <p className="text-slate-600">
                No. Signature verification requires the secret key or public key
                from the token issuer. This tool only decodes the readable parts
                (header and payload). Use libraries like jsonwebtoken in Node.js
                or jjwt in Java for full verification.
              </p>
            </div>
            <div>
              <h3 className="font-bold">What does &quot;exp&quot; mean in the payload?</h3>
              <p className="text-slate-600">
                &quot;exp&quot; is the expiration time claim — a Unix timestamp indicating
                when the token expires. The tool shows it as a human-readable date
                and flags it if expired. Other common claims: &quot;iat&quot; (issued at),
                &quot;sub&quot; (subject/user ID), &quot;iss&quot; (issuer).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-white py-10">
        <div className="container">
          <div className="rounded-lg border border-slate-200 bg-[#f7f4ef] p-6">
            <p className="text-sm font-bold">Need help implementing authentication?</p>
            <p className="mt-2 text-sm text-slate-600">
              If you are building JWT auth, debugging token issues, or need help
              with OAuth/OIDC, send us your use case and we will help.
            </p>
            <a
              className="btn mt-4 inline-flex"
              href="mailto:huazai16168@gmail.com?subject=JWT%20auth%20help%20request"
            >
              Request auth help
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
