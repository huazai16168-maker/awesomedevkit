import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const siteUrl = "https://awesomedevkit.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Free Developer Tools — AI Visibility, SEO, Launch & Dev Utilities | AwesomeDevKit",
    template: "%s | AwesomeDevKit"
  },
  description:
    "12 free developer tools for indie founders: AI search visibility checker, landing page SEO roast, Product Hunt launch copy, SaaS pricing page generator, and dev utilities. No login, no API keys, no cost.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "AwesomeDevKit — Free Developer Tools for Indie Founders",
    description:
      "12 free tools: AI visibility, SEO roast, Product Hunt copy, pricing page generator, and developer utilities. No login, no cost.",
    url: siteUrl,
    siteName: "AwesomeDevKit",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "AwesomeDevKit — Free Developer Tools",
    description:
      "12 free tools for indie developers: AI search visibility, SEO audit, launch copy, and dev utilities. No login, no cost."
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
            <Link href="/tools">All Tools (17)</Link>
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
