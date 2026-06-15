import Link from "next/link";
import { ToolGenerator } from "@/components/ToolGenerator";
import { TOOLS, type Tool } from "@/lib/tools";

export function ToolPage({ tool }: { tool: Tool }) {
  const relatedTools = TOOLS.filter((item) => item.slug !== tool.slug).slice(0, 3);

  return (
    <main>
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="container">
          <Link className="text-sm font-bold text-blue-700" href="/tools">
            All tools
          </Link>
          <p className="eyebrow mt-6">Free developer tool</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-normal md:text-5xl">
            {tool.name}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">{tool.description}</p>
        </div>
      </section>

      <section className="container grid gap-8 py-10 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-8">
          <ToolGenerator tool={tool} />

          <section className="card p-6">
            <h2 className="text-2xl font-black">When to use this</h2>
            <p className="mt-3 text-slate-600">{tool.audience}</p>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {tool.checks.map((check) => (
                <div className="rounded-lg border border-slate-200 p-4" key={check}>
                  <span className="font-bold">{check}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="grid content-start gap-5">
          <section className="card p-5">
            <h2 className="text-lg font-black">SEO targets</h2>
            <ul className="mt-4 grid gap-2 text-sm text-slate-600">
              {tool.keywords.map((keyword) => (
                <li key={keyword}>{keyword}</li>
              ))}
            </ul>
          </section>
          <section className="card bg-emerald-50 p-5">
            <h2 className="text-lg font-black">Need a human review?</h2>
            <p className="mt-3 text-sm text-slate-700">
              Send the output, your URL, and your launch goal. We can turn it into a paid
              copy pack, SEO roast, or launch asset review.
            </p>
            <a
              className="btn mt-5 w-full"
              href={`mailto:huazai16168@gmail.com?subject=${encodeURIComponent(tool.cta)}`}
            >
              {tool.cta}
            </a>
          </section>
          <section className="card p-5">
            <h2 className="text-lg font-black">Related tools</h2>
            <div className="mt-4 grid gap-3">
              {relatedTools.map((item) => (
                <Link className="font-bold text-blue-700" href={`/${item.slug}`} key={item.slug}>
                  {item.name}
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}
