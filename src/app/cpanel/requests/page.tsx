"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { StoredInquiry } from "@/lib/inquiries-store";
import { EXPERIENCES } from "@/lib/data";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function journeyLabel(slug?: string) {
  if (!slug) return "—";
  const exp = EXPERIENCES.find((e) => e.slug === slug || e.id === slug);
  return exp?.title ?? slug;
}

export default function RequestsPage() {
  const [inquiries, setInquiries] = useState<StoredInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchInquiries() {
      try {
        const res = await fetch("/api/inquiries");
        if (!res.ok) {
          if (res.status === 401) setError("Please log in to view inquiries.");
          else setError("Could not load inquiries.");
          return;
        }
        const data = (await res.json()) as { inquiries: StoredInquiry[] };
        setInquiries(data.inquiries ?? []);
      } catch {
        setError("Could not load inquiries.");
      } finally {
        setLoading(false);
      }
    }
    fetchInquiries();
  }, []);

  return (
    <div className="cpanel-requests">
      <div className="card" style={{ marginBottom: "var(--space-6)" }}>
        <h2 className="heading-card" style={{ marginBottom: "var(--space-2)" }}>
          Journey inquiries
        </h2>
        <p className="muted" style={{ margin: 0 }}>
          Review new submissions and follow up with next steps.
        </p>
      </div>

      {loading && (
        <p className="muted">Loading inquiries…</p>
      )}

      {error && (
        <div className="card" style={{ borderColor: "var(--color-error-muted)" }}>
          <p className="muted" style={{ margin: 0 }}>{error}</p>
          <Link href="/login" className="btn btn-primary btn-sm" style={{ marginTop: "var(--space-4)" }}>
            Log in
          </Link>
        </div>
      )}

      {!loading && !error && inquiries.length === 0 && (
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>
            No journey inquiries yet. When guests or members submit an inquiry via{" "}
            <Link href="/request" style={{ color: "var(--color-accent)", fontWeight: 600 }}>
              the request form
            </Link>
            , they&apos;ll appear here.
          </p>
        </div>
      )}

      {!loading && !error && inquiries.length > 0 && (
        <div className="cpanel-inquiry-list">
          {inquiries.map((inq) => (
            <article key={inq.id} className="card cpanel-inquiry-card">
              <div className="cpanel-inquiry-meta">
                <span className="cpanel-inquiry-name">{inq.name}</span>
                <span className="cpanel-inquiry-email">{inq.email}</span>
                <span className="cpanel-inquiry-date">{formatDate(inq.createdAt)}</span>
              </div>
              <div className="cpanel-inquiry-journey">
                <span className="muted" style={{ fontSize: "var(--text-xs)" }}>Journey</span>
                <span>{journeyLabel(inq.journey)}</span>
              </div>
              <p className="cpanel-inquiry-message">{inq.message}</p>
              {inq.userId && (
                <span className="pill" style={{ alignSelf: "flex-start" }}>Logged-in user</span>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
