import type { Metadata } from "next";
import { ToolPage } from "@/components/ToolPage";
import { getTool } from "@/lib/tools";

const tool = getTool("ai-search-visibility-checker")!;

export const metadata: Metadata = {
  title: "Free AI Search Visibility Checker — Test If ChatGPT & Perplexity See Your Site",
  description:
    "Check if your site appears in AI search results (ChatGPT, Perplexity, Gemini, Claude). Get a visibility score across 4 dimensions: content structure, entity clarity, factual authority, and AI citation readiness. Free, no login.",
  alternates: { canonical: `/${tool.slug}` },
};

export default function Page() {
  return <ToolPage tool={tool} />;
}
