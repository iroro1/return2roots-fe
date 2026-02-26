"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { BreadcrumbItem } from "@/components/page-header";
import { PageHeader } from "@/components/page-header";
import { PageCTA } from "@/components/page-cta";
import { EXPERIENCES } from "@/lib/data";

const STEPS = [
  { id: 1, label: "Journey & dates" },
  { id: 2, label: "Preferences" },
  { id: 3, label: "Contact & confirm" },
];

const ACCOMMODATION_OPTIONS = [
  { value: "", label: "No preference" },
  { value: "homestay", label: "Homestay with local family" },
  { value: "hotel", label: "Hotel or guesthouse" },
  { value: "flexible", label: "Flexible / open to suggestions" },
];

type InquiryFormProps = { defaultJourney?: string | null; inquiryType?: "journey" | "residency" };

export default function InquiryForm({ defaultJourney, inquiryType = "journey" }: InquiryFormProps) {
  const { data: session, status: authStatus } = useSession();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [journey, setJourney] = useState(defaultJourney ?? "");
  const [preferredDates, setPreferredDates] = useState("");
  const [accommodationPreference, setAccommodationPreference] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [prefilled, setPrefilled] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus !== "authenticated" || !session?.user || prefilled) return;
    const u = session.user;
    if (u.name) setName(String(u.name));
    if (u.email) setEmail(String(u.email));
    setPrefilled(true);
  }, [authStatus, session?.user, prefilled]);

  const breadcrumb: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Journeys", href: "/experiences" },
    { label: inquiryType === "residency" ? "Residency inquiry" : "Journey inquiry" },
  ];

  function buildMessage(): string {
    const parts: string[] = [message.trim()];
    if (preferredDates.trim()) parts.unshift(`Preferred dates: ${preferredDates.trim()}`);
    if (accommodationPreference && inquiryType === "journey") {
      const label = ACCOMMODATION_OPTIONS.find((o) => o.value === accommodationPreference)?.label ?? accommodationPreference;
      parts.push(`Accommodation: ${label}`);
    }
    return parts.join("\n\n");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("submitting");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          journey: journey || undefined,
          message: buildMessage(),
          preferredDates: preferredDates.trim() || undefined,
          accommodationPreference: accommodationPreference || undefined,
          inquiryType: inquiryType === "residency" ? "residency" : undefined,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }
      setSubmittedEmail(email.trim());
      setStatus("success");
      setName("");
      setEmail("");
      setJourney("");
      setPreferredDates("");
      setAccommodationPreference("");
      setMessage("");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    const secondary = [
      { href: "/experiences", label: "View journeys" },
      ...(session?.user ? [{ href: "/profile", label: "Go to profile" }] : []),
    ];
    return (
      <div className="shell page-inner">
        <section className="inquiry-success">
          <PageHeader
            breadcrumb={breadcrumb}
            pill="Thank you"
            title="We've received your inquiry"
            intro={
              submittedEmail
                ? `We'll respond within 1–2 business days at ${submittedEmail}. Check your inbox for next steps.`
                : "We'll respond within 1–2 business days. Check your inbox for next steps."
            }
          />
          <div className="inquiry-success-next">
            <h3 className="inquiry-success-next-title">What happens next?</h3>
            <ol className="inquiry-success-next-steps">
              <li>We review your inquiry and preferred journey.</li>
              <li>We email you within 1–2 business days with next steps and any questions.</li>
              <li>We guide you through dates, options, and booking—no commitment until you're ready.</li>
            </ol>
          </div>
          <PageCTA
            primary={{ href: "/", label: "Back to home" }}
            secondary={secondary}
          />
        </section>
      </div>
    );
  }

  const journeyTitle = journey ? EXPERIENCES.find((e) => e.id === journey || e.slug === journey)?.title : null;

  return (
    <div className="shell page-inner">
      <section className="inquiry-section">
        <PageHeader
          breadcrumb={breadcrumb}
          pill="Start your journey"
          title={inquiryType === "residency" ? "Residency & long-term stay" : "Journey inquiry"}
          intro={
            inquiryType === "residency"
              ? "Tell us about your interest in long-term stay or residency. We'll guide you through options and next steps."
              : "A clear, guided process: choose your journey, share preferences, then we'll take it from there."
          }
        />

        {/* Step indicator */}
        <div className="inquiry-steps" role="tablist" aria-label="Inquiry steps">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`inquiry-step ${step === s.id ? "inquiry-step-active" : ""} ${step > s.id ? "inquiry-step-done" : ""}`}
            >
              <span className="inquiry-step-num">{step > s.id ? "✓" : s.id}</span>
              <span className="inquiry-step-label">{s.label}</span>
            </div>
          ))}
        </div>

        <form onSubmit={step < 3 ? (e) => { e.preventDefault(); if (step === 1) setStep(2); else setStep(3); } : handleSubmit} className="inquiry-form">
          {session?.user && (
            <p className="muted" style={{ marginBottom: "var(--space-5)", fontSize: "var(--text-sm)" }}>
              Signed in as <strong>{session.user.email}</strong>. We&apos;ve pre-filled your details.
            </p>
          )}

          {/* Step 1: Journey & dates */}
          {step === 1 && (
            <div className="inquiry-step-panel">
              <h2 className="inquiry-step-heading">Choose your journey and dates</h2>
              <div className="form-field">
                <label htmlFor="inquiry-journey" className="form-label">
                  {inquiryType === "residency" ? "Interest (optional)" : "Journey"}
                </label>
                <select
                  id="inquiry-journey"
                  name="journey"
                  value={journey}
                  onChange={(e) => setJourney(e.target.value)}
                  className="form-input form-select"
                >
                  <option value="">
                    {inquiryType === "residency" ? "Residency / long-term only" : "Select a journey"}
                  </option>
                  {EXPERIENCES.map((exp) => (
                    <option key={exp.id} value={exp.id}>
                      {exp.title} — {exp.location}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="inquiry-dates" className="form-label">Preferred dates</label>
                <input
                  id="inquiry-dates"
                  type="text"
                  value={preferredDates}
                  onChange={(e) => setPreferredDates(e.target.value)}
                  className="form-input"
                  placeholder="e.g. June 2026, or 2–3 weeks in Q3"
                />
              </div>
            </div>
          )}

          {/* Step 2: Preferences */}
          {step === 2 && (
            <div className="inquiry-step-panel">
              <h2 className="inquiry-step-heading">Accommodation and message</h2>
              {inquiryType === "journey" && (
                <div className="form-field">
                  <label htmlFor="inquiry-accommodation" className="form-label">Accommodation preference</label>
                  <select
                    id="inquiry-accommodation"
                    value={accommodationPreference}
                    onChange={(e) => setAccommodationPreference(e.target.value)}
                    className="form-input form-select"
                  >
                    {ACCOMMODATION_OPTIONS.map((o) => (
                      <option key={o.value || "none"} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="form-field">
                <label htmlFor="inquiry-message" className="form-label">Message</label>
                <textarea
                  id="inquiry-message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-input form-textarea"
                  placeholder={
                    inquiryType === "residency"
                      ? "Tell us about your plans, timeline, and any questions…"
                      : "Preferred dates, interests, questions…"
                  }
                  rows={5}
                  required
                />
              </div>
            </div>
          )}

          {/* Step 3: Contact & confirm */}
          {step === 3 && (
            <div className="inquiry-step-panel">
              <h2 className="inquiry-step-heading">Contact details and review</h2>
              <div className="inquiry-review card" style={{ marginBottom: "var(--space-6)" }}>
                <h3 className="inquiry-review-title">Summary</h3>
                {journeyTitle && <p><strong>Journey:</strong> {journeyTitle}</p>}
                {preferredDates && <p><strong>Preferred dates:</strong> {preferredDates}</p>}
                {accommodationPreference && inquiryType === "journey" && (
                  <p><strong>Accommodation:</strong> {ACCOMMODATION_OPTIONS.find((o) => o.value === accommodationPreference)?.label ?? accommodationPreference}</p>
                )}
                <p><strong>Message:</strong> {message.trim() || "—"}</p>
              </div>
              <div className="form-field">
                <label htmlFor="inquiry-name" className="form-label">Name</label>
                <input
                  id="inquiry-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="inquiry-email" className="form-label">Email</label>
                <input
                  id="inquiry-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
          )}

          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-actions inquiry-form-actions">
            {step > 1 ? (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setStep((s) => s - 1)}
              >
                Back
              </button>
            ) : (
              <Link href="/experiences" className="btn btn-ghost">View journeys</Link>
            )}
            {step < 3 ? (
              <button type="submit" className="btn btn-primary btn-lg">
                Next
              </button>
            ) : (
              <button type="submit" className="btn btn-primary btn-lg" disabled={status === "submitting"}>
                {status === "submitting" ? "Sending…" : "Send inquiry"}
              </button>
            )}
          </div>
        </form>

        <p className="muted inquiry-note">
          We respond within 1–2 business days. No commitment required.
        </p>
      </section>
    </div>
  );
}
