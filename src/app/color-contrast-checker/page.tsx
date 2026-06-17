import type { Metadata } from "next";
import { ToolPage } from "@/components/ToolPage";
import { getTool } from "@/lib/tools";

const tool = getTool("color-contrast-checker")!;

export const metadata: Metadata = {
  title: "Free Color Contrast Checker — WCAG AA/AAA Accessibility Test",
  description:
    "Check text-background color contrast ratios against WCAG 2.1 AA and AAA standards. Instant pass/fail feedback with color sliders. Find accessible color combinations. Free, no login.",
  alternates: { canonical: "/tools/color-contrast-checker" },
};

export default function Page() {
  return <ToolPage tool={tool} />;
}
