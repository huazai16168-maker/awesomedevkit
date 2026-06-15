import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact AwesomeDevKit for custom SaaS launch and SEO reviews.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main>
      <section className="hero compact">
        <p className="eyebrow">Contact</p>
        <h1>Need a manual review?</h1>
        <p className="hero-copy">
          Send your landing page, app listing, Product Hunt draft, or pricing
          page. You will get a practical review focused on conversion, SEO, and
          launch clarity.
        </p>
        <a
          className="button"
          href="mailto:huazai16168@gmail.com?subject=AwesomeDevKit%20review%20request"
        >
          Email for review
        </a>
      </section>
    </main>
  );
}
