import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "AwesomeDevKit privacy policy.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="legal">
      <h1>Privacy Policy</h1>
      <p>
        AwesomeDevKit provides browser-based tools for developers and founders.
        The first version does not require account creation.
      </p>
      <p>
        If you contact us by email, we will use your email address only to reply
        to your request. If analytics are added later, they will be used to
        understand page performance and improve the tools.
      </p>
      <p>
        Do not submit secrets, passwords, private API keys, or confidential
        customer data into the free tools.
      </p>
      <p>Contact: huazai16168@gmail.com</p>
    </main>
  );
}
