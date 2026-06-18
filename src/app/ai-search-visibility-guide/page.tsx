import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Search Visibility Guide 2026 — How to Check If ChatGPT, Perplexity & Gemini See Your Site",
  description:
    "Complete guide to AI search visibility in 2026: check if your site appears in ChatGPT, Perplexity, and Gemini results. Learn how LLM search works, what affects visibility, and how to monitor your AI search presence. Free tool included.",
  alternates: { canonical: "/ai-search-visibility-guide" },
};

const sections = [
  {
    title: "Why AI search visibility matters now",
    content:
      "In 2026, over 40% of product searches start in an AI tool — ChatGPT, Perplexity, Gemini, or Claude. If your site is invisible to these models, you are losing traffic that Google Analytics will never show you. AI search visibility is the new SEO.",
  },
  {
    title: "How AI search engines pick sources",
    content:
      "LLM-based search tools do not crawl the web like Google. They rely on training data, retrieval-augmented generation (RAG) from indexed sources, and real-time search APIs. Your site needs to be cited in training corpora, appear in RAG retrieval results, or rank in the search APIs these models query behind the scenes.",
  },
  {
    title: "4 dimensions of AI search visibility",
    content:
      "Visibility breaks down into four measurable dimensions: (1) Content structure — clear headings, entity-rich paragraphs, and semantic HTML that models can parse. (2) Entity clarity — explicit mentions of what your product does, who it serves, and how it compares. (3) Factual authority — citations, data references, and consistent claims across your domain. (4) Citation readiness — short, quotable sentences that an LLM can pull as an answer snippet.",
  },
  {
    title: "Why your Google ranking does not predict AI visibility",
    content:
      "Google ranking and AI search visibility are correlated but not identical. A page ranking #3 on Google may never appear in ChatGPT because the model's retrieval layer uses different signals. Conversely, a niche article with clear, factual claims can appear in Perplexity even with zero Google traffic. Track both separately.",
  },
  {
    title: "How to check your AI search visibility",
    content:
      "Manual checks work for a quick sense check — ask ChatGPT or Perplexity 'What is [your product]?' and see if you appear. For systematic tracking, use an AI visibility checker that queries multiple models and returns a structured score across the four dimensions. Run checks monthly; AI model behavior changes with each update.",
  },
];

const faqs = [
  [
    "What is AI search visibility?",
    "AI search visibility measures whether your website, brand, or content appears in AI-powered search tools like ChatGPT, Perplexity, Gemini, and Claude when users ask relevant questions. It is separate from traditional Google search visibility.",
  ],
  [
    "How do I check if my site appears in ChatGPT?",
    "You can manually test by asking ChatGPT about your product category or brand name. For systematic tracking, use an AI search visibility checker that queries multiple models and returns structured results. Check at least monthly — model behavior changes frequently.",
  ],
  [
    "Does appearing in ChatGPT help with SEO?",
    "Indirectly, yes. Users who discover your site through AI search often search for your brand on Google, creating branded search volume. AI citations can also lead to backlinks when writers and developers reference your content. Both signals help traditional SEO.",
  ],
  [
    "Which AI search engines should I track?",
    "Track ChatGPT (largest user base), Perplexity (strongest citation behavior), and Gemini (integrated into Google ecosystem). Claude is also growing rapidly as a research tool. Start with these four, then expand based on your audience.",
  ],
  [
    "How often should I check AI search visibility?",
    "Run a baseline check now, then check monthly. After major site changes (redesign, new content strategy, rebrand), run an immediate re-check. AI models update on their own schedules — your visibility can change even if your site stays the same.",
  ],
];

export default function AISearchVisibilityGuidePage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="container">
          <Link className="text-sm font-bold text-blue-700" href="/">
            Back to AwesomeDevKit
          </Link>
          <p className="eyebrow mt-6">AI &amp; GEO guide</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-normal md:text-5xl">
            AI Search Visibility Guide 2026: ChatGPT, Perplexity &amp; Gemini
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Everything you need to understand, check, and improve your site&apos;s
            visibility in AI-powered search. Updated for how LLMs work in 2026.
          </p>
        </div>
      </section>

      <section className="container py-10">
        <div className="prose max-w-3xl">
          {sections.map((s) => (
            <div key={s.title} className="mb-10">
              <h2 className="text-2xl font-black">{s.title}</h2>
              <p className="mt-3 text-slate-600">{s.content}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-10">
        <div className="container">
          <h2 className="text-3xl font-black">AI search visibility FAQ</h2>
          <div className="mt-8 grid gap-4 max-w-3xl">
            {faqs.map(([q, a]) => (
              <article key={q} className="card p-5">
                <h3 className="font-bold">{q}</h3>
                <p className="mt-2 text-slate-600">{a}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/ai-search-visibility-checker" className="btn">
              Check your AI visibility
            </Link>
            <Link href="/tools" className="btn secondary">
              Explore all free tools
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
