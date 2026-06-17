import type { Metadata } from "next";
import { ToolPage } from "@/components/ToolPage";
import { getTool } from "@/lib/tools";

const tool = getTool("og-image-meta-tag-checker")!;

export const metadata: Metadata = {
  title: "Free OG Meta Tag Checker — Preview Social Cards & Validate Open Graph Tags",
  description:
    "Check your page Open Graph, Twitter Card, and meta tags instantly. See exactly how your link previews on Facebook, X, LinkedIn, and Discord. Flag missing tags and wrong image sizes. Free, no login.",
  alternates: { canonical: "/tools/og-image-meta-tag-checker" },
};

export default function Page() {
  return <ToolPage tool={tool} />;
}
