import type { Metadata } from "next";
import { ToolPage } from "@/components/ToolPage";
import { getTool } from "@/lib/tools";

const tool = getTool("slug-generator")!;

export const metadata: Metadata = {
  title: "Free URL Slug Generator — SEO-Friendly Permalink Creator",
  description:
    "Convert any text into a clean, SEO-friendly URL slug. Remove special chars, lowercase, hyphenate. Handle accented characters and stop words. Free, no login, instant results.",
  alternates: { canonical: "/tools/slug-generator" },
};

export default function Page() {
  return <ToolPage tool={tool} />;
}
