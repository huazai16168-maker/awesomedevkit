import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "$49 Landing Page SEO Audit — Human Review, Actionable Fixes | AwesomeDevKit",
  description:
    "Get a manual, expert review of your landing page. We check SEO, GEO readiness, copy clarity, mobile UX, and conversion structure. Delivered in 3 days with a prioritized fix list.",
  alternates: { canonical: "/landing-page-audit" },
};

// Stripe Payment Link for $49 Landing Page SEO Audit (created 2026-06-22)
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/8x228rg7362I6ikdq2fUQ0i";

export default function LandingPageAuditPage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white py-16">
        <div className="container max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Human SEO Audit — $49
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Landing Page SEO Audit
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            You don&apos;t need another automated tool. You need a real person to look at your
            landing page, find what&apos;s broken, and tell you exactly how to fix it. That&apos;s
            what this is.
          </p>
          <a
            href={STRIPE_PAYMENT_LINK}
            className="mt-8 inline-block rounded-lg bg-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            Get a Landing Page Audit — $49
          </a>
        </div>
      </section>

      {/* What you get */}
      <section className="bg-slate-50 py-14">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-950">What You Get</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              {
                title: "SEO Technical Review",
                items: [
                  "Title tag, meta description, heading structure",
                  "Keyword targeting and cannibalization check",
                  "Internal linking and crawlability audit",
                  "Indexability: robots.txt, canonical, sitemap presence",
                ],
              },
              {
                title: "AI / GEO Readiness",
                items: [
                  "Is your page structured for AI citation?",
                  "Entity clarity and factual authority signals",
                  "Structured data and schema gaps",
                  "Competitor comparison in AI search results",
                ],
              },
              {
                title: "Copy & Conversion Clarity",
                items: [
                  "Above-the-fold messaging audit",
                  "CTA placement, wording, and count",
                  "Social proof and trust signal gaps",
                  "Readability and scannability check",
                ],
              },
              {
                title: "Mobile & UX Quick Scan",
                items: [
                  "Mobile rendering and tap-target spacing",
                  "Page speed and Core Web Vitals flags",
                  "Form accessibility and friction points",
                  "Broken links and redirect chains",
                ],
              },
            ].map((section) => (
              <div
                key={section.title}
                className="rounded-lg border border-slate-200 bg-white p-6"
              >
                <h3 className="font-bold text-slate-900">{section.title}</h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 shrink-0 text-emerald-500">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-14">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-950">How It Works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "You Pay & Submit",
                body: "$49 via Stripe. After checkout, reply to the confirmation email with your URL and 2–3 sentences about your product and target audience.",
              },
              {
                step: "2",
                title: "We Audit",
                body: "We manually review your page across SEO, GEO, copy, and UX. Real human eyes, not a script. We compare against your top 2–3 competitors.",
              },
              {
                step: "3",
                title: "You Get the Report",
                body: "Within 3 business days, you receive a PDF with prioritized fixes, specific rewrites, and a 15-minute follow-up window for questions.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-lg border border-slate-200 bg-[#f7f4ef] p-6"
              >
                <span className="text-3xl font-black text-emerald-600">
                  {item.step}
                </span>
                <h3 className="mt-3 font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample report */}
      <section className="border-t border-slate-200 bg-slate-50 py-14">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-950">
            What a Report Looks Like
          </h2>
          <div className="mt-8 rounded-lg border border-slate-200 bg-white p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Sample Report Structure
            </p>
            <div className="mt-4 space-y-3 font-mono text-sm leading-relaxed text-slate-700">
              <p>
                <span className="font-bold text-slate-900">
                  1. First Impression (30 sec test)
                </span>
                <br />
                What a visitor understands before scrolling. Screenshot with
                annotations.
              </p>
              <p>
                <span className="font-bold text-slate-900">
                  2. SEO Scorecard
                </span>
                <br />
                Title, meta, H1–H3 audit table. Missing keywords. Cannibalization
                flags.
              </p>
              <p>
                <span className="font-bold text-slate-900">
                  3. GEO Readiness
                </span>
                <br />
                Can ChatGPT/Perplexity cite this page? Structured data gaps. Entity
                signals.
              </p>
              <p>
                <span className="font-bold text-slate-900">
                  4. Copy Rewrites
                </span>
                <br />
                Specific before/after suggestions for headline, subhead, CTA.
              </p>
              <p>
                <span className="font-bold text-slate-900">
                  5. Competitor Comparison
                </span>
                <br />
                Your page vs. 2–3 competitors on the same keyword. What they do
                better.
              </p>
              <p>
                <span className="font-bold text-slate-900">
                  6. Prioritized Fix List
                </span>
                <br />
                Ranked by impact. Quick wins first, bigger projects later.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-14">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-950">FAQ</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              {
                q: "Who is this for?",
                a: "Indie founders, SaaS marketers, and solo developers who have a landing page and want an expert to tell them what to fix. No enterprise fluff.",
              },
              {
                q: "What if I don't like the report?",
                a: "If the report doesn't give you at least 3 actionable fixes you can implement this week, email us and we'll refund you. No questions asked.",
              },
              {
                q: "How is this different from an automated tool?",
                a: "Automated tools tell you what's wrong. A human tells you what to fix, in what order, with specific rewrites. Tools don't understand your product or audience.",
              },
              {
                q: "Can you audit a SaaS dashboard or web app?",
                a: "This audit is for marketing landing pages. If you want a SaaS product UX review, contact us and we'll point you in the right direction.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="rounded-md border border-slate-200 bg-white p-5"
              >
                <h3 className="font-bold text-slate-900">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-[#f7f4ef] py-14">
        <div className="container max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-slate-950">
            Your landing page can convert better.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            $49. Human review. Actionable fixes. 3-day turnaround.
          </p>
          <a
            href={STRIPE_PAYMENT_LINK}
            className="mt-8 inline-block rounded-lg bg-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            Get a Landing Page Audit — $49
          </a>
          <p className="mt-4 text-sm text-slate-400">
            Secure payment via Stripe. Refund if not satisfied.
          </p>
        </div>
      </section>
    </main>
  );
}
