import type { Metadata } from "next";
import Link from "next/link";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Free Developer Tools",
  description:
    "Browse free launch, SEO, GEO, pricing, and copy tools for indie developers and SaaS founders.",
  alternates: {
    canonical: "/tools"
  }
};

export default function ToolsPage() {
  return (
    <main className="page">
      <section className="page-heading">
        <p className="eyebrow">Tool library</p>
        <h1>Free tools for developer growth experiments.</h1>
        <p>
          Start with one focused task: launch copy, AI search visibility, checklist
          planning, landing page review, or pricing copy.
        </p>
      </section>
      <section className="tool-grid">
        {tools.map((tool) => (
          <Link href={`/tools/${tool.slug}`} className="tool-card" key={tool.slug}>
            <span className="tool-tag">{tool.category}</span>
            <h2>{tool.name}</h2>
            <p>{tool.summary}</p>
            <strong>{tool.primaryKeyword}</strong>
          </Link>
        ))}
      </section>
    </main>
  );
}
