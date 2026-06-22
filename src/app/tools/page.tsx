import type { Metadata } from "next";
import Link from "next/link";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Free Developer Tools — AI Visibility, SEO, Launch & Dev Utilities",
  description:
    "22 free developer tools for indie founders: AI search visibility checker, Product Hunt launch copy, SEO roast, pricing page generator, regex tester, cron builder, JSON formatter, diff checker, UUID generator, SQL formatter, JWT decoder, image compressor, YAML validator, JSON to CSV converter, and more. No login, no API keys, no token cost.",
  alternates: {
    canonical: "/tools"
  }
};

const categories = [
  {
    name: "SEO & GEO",
    slug: "seo",
    description:
      "Generative engine optimization and search visibility tools. Check how AI search engines see your site, audit your landing page SEO, and preview social cards before you share.",
    tools: tools.filter((t) => t.category === "SEO"),
  },
  {
    name: "Launch & Copywriting",
    slug: "launch",
    description:
      "Go-to-market tools for indie developers. Generate Product Hunt launch copy, SaaS pricing page drafts, and app launch checklists so you ship faster and skip the blank-page paralysis.",
    tools: tools.filter((t) => t.category === "Launch" || t.category === "Copywriting"),
  },
  {
    name: "Developer Utilities",
    slug: "dev-utility",
    description:
      "Everyday tools that run entirely in your browser — regex tester, cron expression builder, JSON formatter, diff checker, UUID generator, and Base64/URL/HTML encoder. No server round-trips, no data leaves your machine.",
    tools: tools.filter((t) => t.category === "Developer Utility"),
  },
];

export default function ToolsPage() {
  return (
    <main className="page">
      {/* ── Hero / Intro ── */}
      <section className="page-heading">
        <p className="eyebrow">Tool library</p>
        <h1>Free tools for developer growth experiments</h1>
        <p className="hero-text">
          Twenty-two focused utilities built for indie developers, SaaS founders, and
          product builders. Each tool targets a single task — AI search visibility,
          launch copy, landing page SEO, pricing page drafts, or everyday dev work —
          and delivers a useful output without login, API keys, or token cost.
        </p>
        <p>
          Pick a tool below, enter a few details about your product, and get a
          ready-to-use result in seconds. No onboarding. No waiting. Just practical
          help for the parts of building software that aren&apos;t writing code.
        </p>
      </section>

      {/* ── How it works ── */}
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">How it works</p>
          <h2>Three steps from idea to output.</h2>
        </div>
        <div className="copy-block" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginTop: "1.5rem" }}>
          <div>
            <strong style={{ fontSize: "1.25rem" }}>1. Pick a tool</strong>
            <p>
              Browse the library below. Each card shows the tool name, category tag,
              and a one-sentence summary. Click any card to open the full tool page
              with input fields and output area.
            </p>
          </div>
          <div>
            <strong style={{ fontSize: "1.25rem" }}>2. Enter your details</strong>
            <p>
              Fill in a few fields — your product name, URL, target audience, and
              any extra context. The form adapts to each tool&apos;s purpose so you
              only answer what matters.
            </p>
          </div>
          <div>
            <strong style={{ fontSize: "1.25rem" }}>3. Get your result</strong>
            <p>
              Hit generate and you get a complete output — a visibility assessment,
              a launch copy draft, a formatted checklist, or a validated expression.
              Copy it, tweak it, ship it.
            </p>
          </div>
        </div>
      </section>

      {/* ── Tools by category ── */}
      {categories.map((cat) => (
        <section className="section" key={cat.slug}>
          <div className="section-heading">
            <p className="eyebrow">{cat.name}</p>
            <h2>
              {cat.name === "SEO & GEO"
                ? "Get found — in search engines and AI answers."
                : cat.name === "Launch & Copywriting"
                  ? "Ship faster with launch-ready copy and checklists."
                  : "Everyday tools that run in your browser."}
            </h2>
            <p>{cat.description}</p>
          </div>
          <div className="tool-grid" style={{ marginTop: "1rem" }}>
            {cat.tools.map((tool) => (
              <Link href={`/tools/${tool.slug}`} className="tool-card" key={tool.slug}>
                <span className="tool-tag">{tool.category}</span>
                <h3>{tool.name}</h3>
                <p>{tool.summary}</p>
                <strong>Open tool</strong>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* ── FAQ ── */}
      <section className="section split">
        <div>
          <p className="eyebrow">Common questions</p>
          <h2>What you need to know before you start.</h2>
        </div>
        <div className="copy-block">
          <h3>Are these tools really free?</h3>
          <p>
            Yes. All twenty-two tools are free to use with no login, no API keys, and no
            token cost. We built them to help indie developers move faster, and
            keeping them free means more people can benefit.
          </p>

          <h3>Do you store my data?</h3>
          <p>
            No. Every tool processes your input entirely in your browser. Product
            names, URLs, audience descriptions, and generated output never leave your
            computer. There are no analytics events tied to your tool inputs.
          </p>

          <h3>How are these different from other free tools?</h3>
          <p>
            Most free developer tools are generic utilities. These are built
            specifically for indie founders and SaaS builders — they understand
            concepts like launch copy, pricing tiers, ASO checklists, and GEO
            optimization. The output is tailored to the context of shipping and
            growing a software product.
          </p>

          <h3>What if I need deeper help?</h3>
          <p>
            Each tool page includes a consultation CTA if you want a human review of
            your launch strategy, SEO, or pricing. For App Store and Google Play
            launch assets — screenshots, captions, localization — visit our sister
            site{" "}
            <a href="https://launchassetkit.com" target="_blank" rel="noreferrer">
              LaunchAssetKit
            </a>
            , which is built specifically for mobile app store publishing.
          </p>

          <h3>Can I suggest a new tool?</h3>
          <p>
            We add tools based on what indie developers actually need. If you have a
            suggestion for a tool that would help you ship or grow faster, reach out
            through the{" "}
            <Link href="/contact">contact page</Link> — we read every submission.
          </p>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="section" style={{ textAlign: "center", paddingTop: "3rem", paddingBottom: "3rem" }}>
        <p className="eyebrow">Ready to start?</p>
        <h2 style={{ marginBottom: "1rem" }}>Pick a tool and ship something today.</h2>
        <p style={{ maxWidth: "32rem", margin: "0 auto 1.5rem" }}>
          Every tool on this page was built to solve one specific problem for indie
          developers. No fluff. No upsells. Just practical output you can use
          immediately.
        </p>
      </section>
    </main>
  );
}
