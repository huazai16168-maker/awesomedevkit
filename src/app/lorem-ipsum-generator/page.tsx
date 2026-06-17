import type { Metadata } from "next";
import { ToolPage } from "@/components/ToolPage";
import { getTool } from "@/lib/tools";

const tool = getTool("lorem-ipsum-generator")!;

export const metadata: Metadata = {
  title: "Free Lorem Ipsum Generator — Placeholder Text for Design & Development",
  description:
    "Generate customizable lorem ipsum placeholder text. Choose paragraphs, sentences, or words. Fun themed variants included. One-click copy. Free, no login.",
  alternates: { canonical: "/tools/lorem-ipsum-generator" },
};

export default function Page() {
  return <ToolPage tool={tool} />;
}
