import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell page-inner">
      <section className="not-found-section">
        <span className="pill">404</span>
        <h1 className="heading-hero page-title">Page not found</h1>
        <p className="muted not-found-intro">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="page-actions not-found-actions">
          <Link href="/" className="btn btn-primary btn-lg">
            Back to home
          </Link>
          <Link href="/experiences" className="btn btn-ghost">
            View journeys
          </Link>
        </div>
      </section>
    </div>
  );
}
