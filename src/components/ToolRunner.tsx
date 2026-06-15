"use client";

import { ToolGenerator } from "@/components/ToolGenerator";
import type { Tool } from "@/lib/tools";

export function ToolRunner({ tool }: { tool: Tool }) {
  return <ToolGenerator tool={tool} />;
}
