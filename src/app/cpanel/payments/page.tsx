export default function PaymentsPage() {
  return (
    <div className="grid" style={{ gap: "20px" }}>
      <div className="card">
        <h2>Placement Fees</h2>
        <p className="muted">
          Track manual payment confirmations for housing placement fees.
        </p>
      </div>
      <div className="card">
        <h3>Recent Payments</h3>
        <ul>
          <li>Invoice R2R-001 — Paid via PayPal</li>
          <li>Invoice R2R-002 — Awaiting confirmation</li>
          <li>Invoice R2R-003 — Paid via Stripe</li>
        </ul>
      </div>
    </div>
  );
}
