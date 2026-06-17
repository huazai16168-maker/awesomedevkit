import type { Metadata } from "next";
import { ToolPage } from "@/components/ToolPage";
import { getTool } from "@/lib/tools";

const tool = getTool("saas-pricing-page-copy-generator")!;

export const metadata: Metadata = {
  title: "Free SaaS Pricing Page Copy Generator — Plan Names, Tiers & FAQ",
  description:
    "Generate complete SaaS pricing page copy in seconds: plan names, feature bullets, pricing tiers, FAQ content, and conversion hooks. Built for indie founders and SaaS builders. Free, no login.",
  alternates: { canonical: `/${tool.slug}` },
};

export default function Page() {
  return <ToolPage tool={tool} />;
}
