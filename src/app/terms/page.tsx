import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "AwesomeDevKit terms of service.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="legal">
      <h1>Terms of Service</h1>
      <p>
        AwesomeDevKit tools are provided for drafting, research, and launch
        preparation. Outputs should be reviewed before publication.
      </p>
      <p>
        We do not guarantee search rankings, platform approvals, conversions,
        revenue, or third-party listing acceptance.
      </p>
      <p>
        Paid manual review work, if ordered, is delivered by email based on the
        scope agreed before payment.
      </p>
      <p>Contact: huazai16168@gmail.com</p>
    </main>
  );
}
