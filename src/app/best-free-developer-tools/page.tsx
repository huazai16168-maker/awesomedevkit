import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Best Free Developer Tools 2026 — 17 Tools for Indie Founders & Developers",
  description:
    "The ultimate list of 17 free developer tools for 2026: AI search visibility checker, regex tester, JSON formatter, diff checker, SEO roast, cron generator, and more. No login, no API keys, no cost. Updated June 2026.",
  alternates: { canonical: "/best-free-developer-tools" },
};

const tools = [
  {
    name: "AI Search Visibility Checker",
    slug: "ai-search-visibility-checker",
    tag: "Growth",
    desc: "Check if your site appears in ChatGPT, Perplexity, Gemini, and Claude. Get a visibility score across 4 dimensions.",
  },
  {
    name: "Landing Page SEO Roast",
    slug: "landing-page-seo-roast",
    tag: "Growth",
    desc: "Paste your URL and get a blunt SEO audit: title tags, headings, content gaps, and what to fix first.",
  },
  {
    name: "Product Hunt Launch Copy Generator",
    slug: "product-hunt-launch-copy-generator",
    tag: "Launch",
    desc: "Generate tagline, short description, long description, and founder comment for your Product Hunt launch.",
  },
  {
    name: "SaaS Pricing Page Copy Generator",
    slug: "saas-pricing-page-copy-generator",
    tag: "Launch",
    desc: "Generate pricing page copy: plan names, feature bullets, FAQs, and tier descriptions.",
  },
  {
    name: "App Launch Checklist Generator",
    slug: "app-launch-checklist-generator",
    tag: "Launch",
    desc: "Custom launch checklists by store type (App Store / Google Play) and target market.",
  },
  {
    name: "Regex Tester",
    slug: "regex-tester",
    tag: "Dev",
    desc: "Real-time regex testing with match highlighting, capture groups, and replacement preview.",
  },
  {
    name: "Cron Expression Generator",
    slug: "cron-expression-generator",
    tag: "Dev",
    desc: "Visual cron builder with human-readable output. Supports standard 5-field and extended expressions.",
  },
  {
    name: "JSON Formatter & Validator",
    slug: "json-formatter",
    tag: "Dev",
    desc: "Format, validate, and minify JSON in-browser. Handles large payloads with error line highlighting.",
  },
  {
    name: "Diff Checker — Text & Code Compare",
    slug: "diff-checker",
    tag: "Dev",
    desc: "Side-by-side text and code comparison. Find differences instantly without installing anything.",
  },
  {
    name: "UUID & ULID Generator",
    slug: "uuid-generator",
    tag: "Dev",
    desc: "Batch generate up to 100 UUIDs or ULIDs. Copy individually or export all at once.",
  },
  {
    name: "Base64, URL & HTML Encoder / Decoder",
    slug: "base64-encoder-decoder",
    tag: "Dev",
    desc: "Encode and decode Base64, URL-encoded strings, and HTML entities. All in one page.",
  },
  {
    name: "Social Card Previewer",
    slug: "social-card-previewer",
    tag: "Dev",
    desc: "Preview how your link appears on X/Twitter, LinkedIn, Discord, and Slack before publishing.",
  },
  {
    name: "OG Image & Meta Tag Checker",
    slug: "og-image-meta-tag-checker",
    tag: "SEO",
    desc: "Check Open Graph, Twitter Card, and meta tags on any URL. See exactly what platforms see.",
  },
  {
    name: "Favicon Generator",
    slug: "favicon-generator",
    tag: "Dev",
    desc: "Generate .ico, all PNG sizes, Apple Touch Icon, and the HTML code to paste into your head tag.",
  },
  {
    name: "Color Contrast Checker",
    slug: "color-contrast-checker",
    tag: "A11y",
    desc: "Check text/background color pairs against WCAG 2.1 AA and AAA contrast requirements.",
  },
  {
    name: "URL Slug Generator",
    slug: "slug-generator",
    tag: "SEO",
    desc: "Create clean, SEO-friendly URL slugs from any text. Handles special characters and stop words.",
  },
  {
    name: "Lorem Ipsum Generator",
    slug: "lorem-ipsum-generator",
    tag: "Dev",
    desc: "Generate placeholder text with themed variants. Pick paragraph count, word count, or character length.",
  },
];

export default function BestFreeDeveloperToolsPage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="container">
          <Link className="text-sm font-bold text-blue-700" href="/">
            Back to AwesomeDevKit
          </Link>
          <p className="eyebrow mt-6">Tools roundup</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-normal md:text-5xl">
            Best Free Developer Tools 2026
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            17 free tools for indie developers, SaaS founders, and product builders.
            AI visibility, SEO audits, launch copy, regex, JSON, diff checking, and more.
            No login, no API keys, no cost.
          </p>
        </div>
      </section>

      <section className="container py-10">
        <div className="grid gap-4">
          {tools.map((tool) => (
            <Link key={tool.slug} href={`/${tool.slug}`} className="card block p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold">{tool.name}</h2>
                  <p className="mt-1 text-slate-600">{tool.desc}</p>
                </div>
                <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-500 whitespace-nowrap">
                  {tool.tag}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 py-14 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-black">All free. All in the browser.</h2>
          <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
            No sign-up forms. No API keys. No token limits. Every tool runs directly in your browser.
            Bookmark the ones you use most.
          </p>
          <Link href="/tools" className="btn mt-8 inline-flex" style={{ background: "#fff", color: "#08111f" }}>
            Browse all 17 tools
          </Link>
        </div>
      </section>
    </main>
  );
}
