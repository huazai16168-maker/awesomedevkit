import type { Metadata } from "next";
import { ToolPage } from "@/components/ToolPage";
import { getTool } from "@/lib/tools";

const tool = getTool("landing-page-seo-roast")!;

export const metadata: Metadata = {
  title: "Free Landing Page SEO Roast — Blunt Audit in 60 Seconds",
  description:
    "Get a brutally honest SEO audit of your landing page: title tags, meta description, heading structure, keyword usage, content depth, and mobile readiness. No fluff. No login. Just actionable fixes for indie founders.",
  alternates: { canonical: `/${tool.slug}` },
};

export default function Page() {
  return <ToolPage tool={tool} />;
}
