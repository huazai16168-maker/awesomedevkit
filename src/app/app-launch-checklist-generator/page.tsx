import type { Metadata } from "next";
import { ToolPage } from "@/components/ToolPage";
import { getTool } from "@/lib/tools";

const tool = getTool("app-launch-checklist-generator")!;

export const metadata: Metadata = {
  title: "Free App Launch Checklist Generator — iOS & Android Pre-Launch Planning",
  description:
    "Generate a complete app launch checklist: store listing, screenshots, ASO copy, Product Hunt, Reddit, localization, and post-launch tracking. Built for indie iOS and Android developers. Free, no login, no signup.",
  alternates: { canonical: `/${tool.slug}` },
};

export default function Page() {
  return <ToolPage tool={tool} />;
}
