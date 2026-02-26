export default function SourcersPage() {
  return (
    <div className="grid" style={{ gap: "20px" }}>
      <div className="card">
        <h2>Sourcer Assignments</h2>
        <p className="muted">
          Track which local sourcers are handling each request.
        </p>
      </div>
      <div className="card">
        <h3>Active Sourcers</h3>
        <ul>
          <li>Kwame O. — Assigned to 4 requests</li>
          <li>Efua S. — Assigned to 2 requests</li>
          <li>Yaw K. — Assigned to 1 request</li>
        </ul>
      </div>
    </div>
  );
}
