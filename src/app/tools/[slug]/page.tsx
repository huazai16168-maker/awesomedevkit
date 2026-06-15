import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ToolRunner } from "@/components/ToolRunner";
import { getTool, tools } from "@/lib/tools";

const siteUrl = "https://awesomedevkit.com";

type PageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const tool = getTool(params.slug);
  if (!tool) {
    return {};
  }

  return {
    title: tool.name,
    description: tool.summary,
    alternates: {
      canonical: `/tools/${tool.slug}`
    },
    openGraph: {
      title: tool.name,
      description: tool.summary,
      url: `${siteUrl}/tools/${tool.slug}`,
      type: "website"
    },
    twitter: {
      card: "summary",
      title: tool.name,
      description: tool.summary
    }
  };
}

export default function ToolPage({ params }: PageProps) {
  const tool = getTool(params.slug);
  if (!tool) {
    notFound();
  }

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    url: `${siteUrl}/tools/${tool.slug}`,
    description: tool.summary,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <main className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="tool-hero">
        <div>
          <p className="eyebrow">{tool.category}</p>
          <h1>{tool.name}</h1>
          <p>{tool.description}</p>
          <div className="keyword-row">
            {tool.keywords.map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>
        </div>
        <aside className="intent-card">
          <strong>Search intent</strong>
          <p>{tool.intent}</p>
        </aside>
      </section>

      <ToolRunner tool={tool} />

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">How to use it</p>
          <h2>Turn the output into a validation asset.</h2>
        </div>
        <div className="steps">
          {tool.steps.map((step, index) => (
            <div className="step" key={step}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Related tools</p>
          <h2>Keep the workflow moving.</h2>
        </div>
        <div className="related-row">
          {tools
            .filter((item) => item.slug !== tool.slug)
            .slice(0, 3)
            .map((item) => (
              <Link href={`/tools/${item.slug}`} key={item.slug} className="related-card">
                <strong>{item.name}</strong>
                <span>{item.primaryKeyword}</span>
              </Link>
            ))}
        </div>
      </section>
    </main>
  );
}
