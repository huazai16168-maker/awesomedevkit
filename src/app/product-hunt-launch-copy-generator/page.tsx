import type { Metadata } from "next";
import { ToolPage } from "@/components/ToolPage";
import { getTool } from "@/lib/tools";

const tool = getTool("product-hunt-launch-copy-generator")!;

export const metadata: Metadata = {
  title: "Free Product Hunt Launch Copy Generator — Tagline, Description & Maker Comment",
  description:
    "Generate your complete Product Hunt launch copy: punchy tagline, compelling description, and human-first maker comment. Built for indie founders who want to skip the blank-page panic. Free, no login, no AI fluff.",
  alternates: { canonical: `/${tool.slug}` },
};

export default function Page() {
  return <ToolPage tool={tool} />;
}
