import Link from "next/link";
import { tools } from "@/lib/tools";

const siteUrl = "https://awesomedevkit.com";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AwesomeDevKit",
    url: siteUrl,
    description:
      "Practical launch, SEO, GEO, pricing, and copy tools for indie developers and SaaS founders.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/tools?query={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AwesomeDevKit tools",
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/tools/${tool.slug}`,
      name: tool.name
    }))
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Developer growth tools</p>
          <h1>Practical launch and growth tools for indie developers.</h1>
          <p className="hero-text">
            Test small product ideas, improve launch copy, prepare SEO pages, and find the
            clearest next action before spending weeks on a full SaaS build.
          </p>
          <div className="hero-actions">
            <Link href="/tools" className="button primary">
              Browse tools
            </Link>
            <Link href="/tools/ai-search-visibility-checker" className="button secondary">
              Check AI visibility
            </Link>
          </div>
        </div>
        <div className="hero-panel" aria-label="Experiment framework">
          <div className="metric">
            <span>1</span>
            <p>Build a lightweight tool</p>
          </div>
          <div className="metric">
            <span>2</span>
            <p>Publish a focused SEO page</p>
          </div>
          <div className="metric">
            <span>3</span>
            <p>Track impressions, clicks, and leads</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">First experiments</p>
          <h2>Five tools to validate developer demand.</h2>
          <p>
            Each page targets a specific search intent and produces a useful output without
            login, API keys, or token cost.
          </p>
        </div>
        <div className="tool-grid">
          {tools.map((tool) => (
            <Link href={`/tools/${tool.slug}`} className="tool-card" key={tool.slug}>
              <span className="tool-tag">{tool.category}</span>
              <h3>{tool.name}</h3>
              <p>{tool.summary}</p>
              <strong>Open tool</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="section split">
        <div>
          <p className="eyebrow">Why this site exists</p>
          <h2>A mother site for small, measurable experiments.</h2>
        </div>
        <div className="copy-block">
          <p>
            AwesomeDevKit is for testing multiple developer-facing tools under one domain.
            The goal is not to build a large platform first. The goal is to publish useful
            pages, measure search demand, collect clicks or leads, and then turn the best
            signals into deeper products.
          </p>
          <p>
            For App Store and Google Play launch assets, use the more focused sister site:
            <a href="https://launchassetkit.com" target="_blank" rel="noreferrer">
              {" "}
              LaunchAssetKit
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
