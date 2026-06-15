import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const siteUrl = "https://awesomedevkit.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AwesomeDevKit - Practical Tools for Indie Developers",
    template: "%s | AwesomeDevKit"
  },
  description:
    "Free launch, SEO, GEO, pricing, and copy tools for indie developers, SaaS founders, and developer tool makers.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "AwesomeDevKit",
    description:
      "Practical launch and growth tools for indie developers, SaaS founders, and developer tool makers.",
    url: siteUrl,
    siteName: "AwesomeDevKit",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "AwesomeDevKit",
    description:
      "Free launch and growth tools for indie developers, SaaS founders, and developer tool makers."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link href="/" className="brand" aria-label="AwesomeDevKit home">
            AwesomeDevKit
          </Link>
          <nav className="site-nav" aria-label="Primary navigation">
            <Link href="/tools">Tools</Link>
            <a href="https://launchassetkit.com" target="_blank" rel="noreferrer">
              LaunchAssetKit
            </a>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <div>
            <strong>AwesomeDevKit</strong>
            <p>Small tools for indie developers, SaaS founders, and product builders.</p>
          </div>
          <div className="footer-links">
            <Link href="/tools">All tools</Link>
            <a href="https://launchassetkit.com" target="_blank" rel="noreferrer">
              App launch assets
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
