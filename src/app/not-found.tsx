import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page">
      <section className="page-heading">
        <p className="eyebrow">Not found</p>
        <h1>This tool page does not exist.</h1>
        <p>Open the tool library and choose one of the current experiments.</p>
        <Link href="/tools" className="button primary">
          Browse tools
        </Link>
      </section>
    </main>
  );
}
