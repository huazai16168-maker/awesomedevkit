import type { Metadata } from "next";
import { ToolPage } from "@/components/ToolPage";
import { getTool } from "@/lib/tools";

const tool = getTool("favicon-generator")!;

export const metadata: Metadata = {
  title: "Free Favicon Generator — ICO, PNG & Apple Touch Icon [No Upload]",
  description:
    "Generate every favicon format from a single image: .ico, all PNG sizes, Apple Touch Icon, PWA icons, plus HTML code. 100% browser-based — your image never leaves your computer.",
  alternates: { canonical: "/tools/favicon-generator" },
};

export default function Page() {
  return <ToolPage tool={tool} />;
}
