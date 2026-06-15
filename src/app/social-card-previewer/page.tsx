"use client";

import { useMemo, useState } from "react";

/* ── Shape of parsed OG / Twitter metadata ── */
interface SocialMeta {
  title: string;
  description: string;
  image: string;
  siteName: string;
  url: string;
  twitterCard: "summary" | "summary_large_image" | "app" | "player";
  favicon: string;
}

const DEFAULT_META: SocialMeta = {
  title: "AwesomeDevKit — Free Developer Tools",
  description:
    "A collection of free, browser-based developer utilities. No login required, no server round trips.",
  image: "https://awesomedevkit.com/og-image.png",
  siteName: "AwesomeDevKit",
  url: "https://awesomedevkit.com",
  twitterCard: "summary_large_image",
  favicon: "",
};

/* ── Attempt to parse OG tags from raw HTML ── */
function parseMetaFromHtml(html: string): Partial<SocialMeta> {
  const meta: Partial<SocialMeta> = {};
  const getContent = (prop: string): string | undefined => {
    const patterns = [
      new RegExp(`<meta[^>]+property="${prop}"[^>]+content="([^"]*)"`, "i"),
      new RegExp(`<meta[^>]+content="([^"]*)"[^>]+property="${prop}"`, "i"),
      new RegExp(`<meta[^>]+name="${prop}"[^>]+content="([^"]*)"`, "i"),
      new RegExp(`<meta[^>]+content="([^"]*)"[^>]+name="${prop}"`, "i"),
    ];
    for (const p of patterns) {
      const m = html.match(p);
      if (m) return m[1];
    }
    return undefined;
  };

  const title =
    getContent("og:title") ||
    getContent("twitter:title") ||
    html.match(/<title>([^<]*)<\/title>/i)?.[1];
  if (title) meta.title = title;

  const desc =
    getContent("og:description") ||
    getContent("twitter:description") ||
    getContent("description");
  if (desc) meta.description = desc;

  const image =
    getContent("og:image") || getContent("twitter:image");
  if (image) meta.image = image;

  const siteName = getContent("og:site_name");
  if (siteName) meta.siteName = siteName;

  const url = getContent("og:url");
  if (url) meta.url = url;

  const tc = getContent("twitter:card");
  if (
    tc &&
    ["summary", "summary_large_image", "app", "player"].includes(tc)
  )
    meta.twitterCard = tc as SocialMeta["twitterCard"];

  return meta;
}

export default function SocialCardPreviewerPage() {
  const [mode, setMode] = useState<"manual" | "html" | "url">("manual");
  const [meta, setMeta] = useState<SocialMeta>(DEFAULT_META);
  const [htmlInput, setHtmlInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");

  /* ── Platforms ── */
  const platforms = [
    { id: "twitter", label: "X (Twitter)" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "facebook", label: "Facebook" },
    { id: "discord", label: "Discord / Slack" },
  ] as const;
  const [activePlatform, setActivePlatform] = useState<string>("twitter");

  /* ── Raw meta tags snippet ── */
  const metaSnippet = useMemo(() => {
    const lines = [
      `<meta property="og:title" content="${escapeAttr(meta.title)}" />`,
      `<meta property="og:description" content="${escapeAttr(meta.description)}" />`,
      `<meta property="og:image" content="${escapeAttr(meta.image)}" />`,
      `<meta property="og:url" content="${escapeAttr(meta.url)}" />`,
      `<meta property="og:site_name" content="${escapeAttr(meta.siteName)}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta name="twitter:card" content="${meta.twitterCard}" />`,
      `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`,
      `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`,
      meta.image ? `<meta name="twitter:image" content="${escapeAttr(meta.image)}" />` : "",
    ].filter(Boolean);
    return lines.join("\n");
  }, [meta]);

  async function fetchFromUrl() {
    if (!urlInput.trim()) return;
    setFetching(true);
    setFetchError("");
    try {
      // Try direct fetch first
      const res = await fetch(urlInput, {
        signal: AbortSignal.timeout(8000),
      });
      const html = await res.text();
      const parsed = parseMetaFromHtml(html);
      if (Object.keys(parsed).length > 0) {
        setMeta((prev) => ({ ...prev, ...parsed }));
        // Also try to get favicon
        const favMatch = html.match(
          /<link[^>]+rel=["'](?:icon|shortcut icon)["'][^>]+href=["']([^"']*)["']/i
        );
        if (favMatch) {
          const fav = favMatch[1];
          setMeta((prev) => ({
            ...prev,
            favicon: fav.startsWith("http") ? fav : new URL(fav, urlInput).href,
          }));
        }
      } else {
        setFetchError("No Open Graph or Twitter Card meta tags found on that page.");
      }
    } catch (e) {
      setFetchError(
        `Could not fetch URL. This is usually due to CORS restrictions. ` +
          `Try pasting your page's meta tags using the "Paste HTML" mode instead.\n` +
          `(${(e as Error).message})`
      );
    } finally {
      setFetching(false);
    }
  }

  function updateMeta(field: keyof SocialMeta, value: string) {
    setMeta((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <main>
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="container">
          <p className="eyebrow">Free developer utility</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-normal md:text-5xl">
            Social Card Previewer
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Preview how your website looks when shared on X/Twitter, LinkedIn,
            Facebook, Discord, and Slack. Check your OG and Twitter Card meta
            tags before you ship.
          </p>
        </div>
      </section>

      <section className="container grid gap-8 py-10 lg:grid-cols-[1fr_400px]">
        {/* ── Left: Input ── */}
        <div className="grid gap-5 content-start">
          {/* Mode tabs */}
          <div className="flex gap-2 border-b border-slate-200 pb-3">
            {[
              { id: "manual", label: "Manual input" },
              { id: "html", label: "Paste HTML" },
              { id: "url", label: "From URL" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMode(tab.id as typeof mode)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  mode === tab.id
                    ? "bg-slate-800 text-white"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Manual mode */}
          {mode === "manual" && (
            <div className="grid gap-4">
              {([
                { key: "title", label: "Title", placeholder: "Page title" },
                { key: "description", label: "Description", placeholder: "Meta description", multiline: true },
                { key: "image", label: "Image URL", placeholder: "https://example.com/og-image.png" },
                { key: "siteName", label: "Site name", placeholder: "My Website" },
                { key: "url", label: "Page URL", placeholder: "https://example.com/page" },
              ] as const).map((field) => (
                <label key={field.key} className="grid gap-1.5">
                  <span className="text-xs font-semibold text-slate-500">
                    {field.label}
                  </span>
                  {'multiline' in field && field.multiline ? (
                    <textarea
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      value={meta[field.key as keyof SocialMeta] as string}
                      onChange={(e) =>
                        updateMeta(field.key as keyof SocialMeta, e.target.value)
                      }
                      rows={2}
                    />
                  ) : (
                    <input
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      value={meta[field.key as keyof SocialMeta] as string}
                      onChange={(e) =>
                        updateMeta(field.key as keyof SocialMeta, e.target.value)
                      }
                      placeholder={field.placeholder}
                    />
                  )}
                </label>
              ))}
              {/* Twitter card type */}
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold text-slate-500">
                  Twitter card type
                </span>
                <select
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  value={meta.twitterCard}
                  onChange={(e) =>
                    updateMeta("twitterCard", e.target.value)
                  }
                >
                  <option value="summary_large_image">Summary large image</option>
                  <option value="summary">Summary</option>
                  <option value="app">App</option>
                  <option value="player">Player</option>
                </select>
              </label>
            </div>
          )}

          {/* HTML paste mode */}
          {mode === "html" && (
            <div className="grid gap-3">
              <p className="text-sm text-slate-500">
                Paste your page&#39;s <code className="font-mono text-xs bg-slate-100 px-1 rounded">&lt;head&gt;</code> or meta tags. We&#39;ll extract OG and Twitter Card data.
              </p>
              <textarea
                className="min-h-40 rounded-lg border border-slate-300 px-3 py-3 font-mono text-sm"
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                placeholder='<meta property="og:title" content="..." />'
                spellCheck={false}
              />
              <button
                onClick={() => {
                  const parsed = parseMetaFromHtml(htmlInput);
                  if (Object.keys(parsed).length > 0) {
                    setMeta((prev) => ({ ...prev, ...parsed }));
                  }
                }}
                className="btn self-start"
              >
                Parse meta tags
              </button>
            </div>
          )}

          {/* URL mode */}
          {mode === "url" && (
            <div className="grid gap-3">
              <p className="text-sm text-slate-500">
                Enter a URL to fetch its OG and Twitter Card metadata.
                <br />
                <span className="text-amber-600">
                  Note: Many sites block direct fetches (CORS). If this fails,
                  use the manual or HTML paste mode instead.
                </span>
              </p>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/page"
                />
                <button
                  onClick={fetchFromUrl}
                  disabled={fetching || !urlInput.trim()}
                  className="btn"
                >
                  {fetching ? "Fetching..." : "Fetch"}
                </button>
              </div>
              {fetchError && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700 whitespace-pre-wrap">
                  {fetchError}
                </div>
              )}
            </div>
          )}

          {/* Raw meta tags */}
          <details className="rounded-lg border border-slate-200 bg-white">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-600 hover:text-slate-800">
              View raw meta tags
            </summary>
            <div className="border-t border-slate-200 p-4">
              <pre className="overflow-auto text-xs font-mono text-slate-600 whitespace-pre-wrap">
                {metaSnippet}
              </pre>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(metaSnippet);
                }}
                className="mt-3 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-300"
              >
                Copy meta tags
              </button>
            </div>
          </details>
        </div>

        {/* ── Right: Previews ── */}
        <div className="grid gap-4 content-start">
          {/* Platform tabs */}
          <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePlatform(p.id)}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  activePlatform === p.id
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Preview card */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            {activePlatform === "twitter" && <TwitterPreview meta={meta} />}
            {activePlatform === "linkedin" && <LinkedInPreview meta={meta} />}
            {activePlatform === "facebook" && <FacebookPreview meta={meta} />}
            {activePlatform === "discord" && <DiscordPreview meta={meta} />}
          </div>

          <p className="text-xs text-slate-400 text-center">
            Preview is approximate. Actual rendering varies by platform, device, and context.
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-10">
        <div className="container">
          <div className="rounded-lg border border-slate-200 bg-[#f7f4ef] p-6">
            <p className="text-sm font-bold">Need help with social media previews?</p>
            <p className="mt-2 text-sm text-slate-600">
              If you are debugging why your shared links look wrong or need help
              setting up Open Graph tags, send us your use case and we will help.
            </p>
            <a
              className="btn mt-4 inline-flex"
              href="mailto:huazai16168@gmail.com?subject=Social%20card%20help"
            >
              Request social card help
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ── Helper ── */
function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ── X / Twitter Preview ── */
function TwitterPreview({ meta }: { meta: SocialMeta }) {
  return (
    <div className="p-4 font-sans">
      <div className="max-w-sm rounded-xl border border-slate-200 overflow-hidden bg-white">
        {/* Image */}
        <div className="h-48 bg-slate-100 overflow-hidden">
          {meta.image ? (
            <img
              src={meta.image}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-300 text-sm">
              No image
            </div>
          )}
        </div>
        {/* Text */}
        <div className="p-3">
          {meta.twitterCard === "summary" && meta.image && (
            <div className="float-right ml-2 h-16 w-16 rounded bg-slate-100 overflow-hidden">
              <img src={meta.image} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <p className="text-xs text-slate-500 uppercase tracking-wide">
            {meta.url ? new URL(meta.url).hostname.replace("www.", "") : "website.com"}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
            {meta.title || "Untitled"}
          </p>
          <p className="mt-0.5 text-sm text-slate-600 leading-snug line-clamp-2">
            {meta.description || ""}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── LinkedIn Preview ── */
function LinkedInPreview({ meta }: { meta: SocialMeta }) {
  return (
    <div className="p-4 font-sans">
      <div className="max-w-md rounded-lg border border-slate-200 overflow-hidden bg-white">
        {/* Image */}
        <div className="h-52 bg-slate-100 overflow-hidden">
          {meta.image ? (
            <img
              src={meta.image}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-300 text-sm">
              No image
            </div>
          )}
        </div>
        {/* Text */}
        <div className="p-3">
          <p className="text-xs text-slate-500">{meta.url ? new URL(meta.url).hostname.replace("www.", "") : ""}</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
            {meta.title || "Untitled"}
          </p>
          <p className="mt-0.5 text-sm text-slate-600 leading-snug line-clamp-3">
            {meta.description || ""}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Facebook Preview ── */
function FacebookPreview({ meta }: { meta: SocialMeta }) {
  return (
    <div className="p-4 font-sans">
      <div className="max-w-md rounded-lg overflow-hidden bg-white">
        {/* Image */}
        <div className="h-52 bg-slate-100 overflow-hidden">
          {meta.image ? (
            <img
              src={meta.image}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-300 text-sm">
              No image
            </div>
          )}
        </div>
        {/* Text */}
        <div className="p-3 border-x border-b border-slate-200 rounded-b-lg">
          <p className="text-xs uppercase text-slate-400 tracking-wide font-semibold">
            {meta.siteName || (meta.url ? new URL(meta.url).hostname.replace("www.", "") : "")}
          </p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
            {meta.title || "Untitled"}
          </p>
          <p className="mt-0.5 text-sm text-slate-600 leading-snug line-clamp-3">
            {meta.description || ""}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Discord / Slack Preview ── */
function DiscordPreview({ meta }: { meta: SocialMeta }) {
  return (
    <div className="p-4 font-sans">
      <div className="max-w-md rounded-lg overflow-hidden" style={{ backgroundColor: "#2f3136" }}>
        <div className="flex">
          {/* Left accent border */}
          <div className="w-1 shrink-0 rounded-l" style={{ backgroundColor: "#202225" }} />
          {/* Content */}
          <div className="flex-1 px-3 py-2.5">
            {/* Site name */}
            <p className="text-xs font-semibold" style={{ color: "#00aff4" }}>
              {meta.siteName || (meta.url ? new URL(meta.url).hostname : "website")}
            </p>
            {/* Title */}
            <p className="mt-1 text-sm font-semibold text-white leading-snug line-clamp-2">
              {meta.title || "Untitled"}
            </p>
            {/* Description */}
            <p className="mt-0.5 text-sm leading-snug line-clamp-2" style={{ color: "#dcddde" }}>
              {meta.description || ""}
            </p>
            {/* Image */}
            {meta.image && (
              <div className="mt-2 rounded-lg overflow-hidden border" style={{ borderColor: "#40444b" }}>
                <img
                  src={meta.image}
                  alt=""
                  className="w-full max-h-40 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
