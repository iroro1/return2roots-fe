import Link from "next/link";

export default function CPanelPage() {
  return (
    <div className="grid" style={{ gap: "var(--space-6)" }}>
      <div className="card">
        <h2 className="heading-card" style={{ marginBottom: "var(--space-2)" }}>
          Admin
        </h2>
        <p className="muted" style={{ margin: 0 }}>
          Manage journey inquiries, review submissions, and guide members through next steps.
        </p>
      </div>
      <div className="card">
        <h3 className="heading-card" style={{ marginBottom: "var(--space-4)", fontSize: "var(--text-lg)" }}>
          Quick links
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
          <Link href="/cpanel/requests" className="btn btn-primary">
            Journey inquiries
          </Link>
          <Link href="/request" className="btn btn-ghost">
            View request form
          </Link>
        </div>
      </div>
    </div>
  );
}
