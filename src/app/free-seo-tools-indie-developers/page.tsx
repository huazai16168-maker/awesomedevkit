import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free SEO Tools for Indie Developers 2026 — Audit, Monitor & Improve Rankings",
  description:
    "The best free SEO tools for indie developers in 2026: landing page SEO roast, OG image checker, URL slug generator, AI search visibility checker, and more. No login, no cost, no API keys. Start improving rankings today.",
  alternates: { canonical: "/free-seo-tools-indie-developers" },
};

const seoTools = [
  {
    name: "Landing Page SEO Roast",
    slug: "landing-page-seo-roast",
    desc: "Paste your URL and get a blunt, actionable audit of your title tags, meta description, heading structure, content gaps, and technical issues. No flattery — just what to fix first.",
    why: "Most SEO audits cost $200+. This one is free and gives you the same checklist a paid auditor would start with.",
  },
  {
    name: "AI Search Visibility Checker",
    slug: "ai-search-visibility-checker",
    desc: "Check if your site appears in ChatGPT, Perplexity, Gemini, and Claude results. Get a visibility score across content structure, entity clarity, factual authority, and citation readiness.",
    why: "Google Analytics cannot track AI search traffic. This tool fills the gap for the fastest-growing search channel.",
  },
  {
    name: "OG Image & Meta Tag Checker",
    slug: "og-image-meta-tag-checker",
    desc: "Check Open Graph, Twitter Card, and meta tags on any URL. See exactly what X/Twitter, LinkedIn, Discord, and Slack will display when someone shares your link.",
    why: "Broken social cards lose clicks. Fix them before sharing — this tool shows you the exact preview each platform sees.",
  },
  {
    name: "URL Slug Generator",
    slug: "slug-generator",
    desc: "Create clean, SEO-friendly URL slugs from any text. Strips stop words, normalizes special characters, and outputs consistent lowercase slugs ready for production.",
    why: "URL structure affects both rankings and click-through. Clean slugs rank better and get more clicks than auto-generated IDs.",
  },
  {
    name: "Social Card Previewer",
    slug: "social-card-previewer",
    desc: "Preview how your link will appear on X/Twitter, LinkedIn, Discord, and Slack before you publish. Spot truncation, missing images, and formatting issues early.",
    why: "Each platform renders link previews differently. Test all four before promoting your content.",
  },
];

export default function FreeSEOToolsPage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="container">
          <Link className="text-sm font-bold text-blue-700" href="/">
            Back to AwesomeDevKit
          </Link>
          <p className="eyebrow mt-6">SEO tools roundup</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-normal md:text-5xl">
            Free SEO Tools for Indie Developers 2026
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Five free SEO tools built for indie developers and SaaS founders.
            Audit your landing page, check AI search visibility, validate meta tags,
            and generate clean URLs — all without logging in or paying a cent.
          </p>
        </div>
      </section>

      <section className="container py-10">
        <div className="grid gap-6 max-w-3xl">
          {seoTools.map((tool) => (
            <article key={tool.slug} className="card p-6">
              <h2 className="text-xl font-black">
                <Link href={`/${tool.slug}`} className="text-blue-700">
                  {tool.name}
                </Link>
              </h2>
              <p className="mt-2 text-slate-600">{tool.desc}</p>
              <div className="mt-3 rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">
                <strong>Why it matters: </strong>
                {tool.why}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 py-14 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-black">SEO does not have to cost money</h2>
          <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
            Start with free audits, fix the basics, and track your progress. Pay for tools
            only when you have revenue to justify them. These five are enough to get your
            first organic traffic.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/landing-page-seo-roast" className="btn" style={{ background: "#fff", color: "#08111f" }}>
              Roast your landing page
            </Link>
            <Link href="/tools" className="btn secondary" style={{ borderColor: "#fff", color: "#fff" }}>
              All 17 tools
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
