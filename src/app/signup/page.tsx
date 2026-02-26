import type { Metadata } from "next";
import { Suspense } from "react";
import { SignupPageContent } from "@/components/signup-page-content";

export const metadata: Metadata = {
  title: "Sign up | Return to Roots",
  description: "Create an account to manage your profile and journey inquiries.",
};

function SignupFallback() {
  return (
    <div style={{ paddingTop: "var(--space-4)" }}>
      <p className="muted">Loading…</p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="shell page-inner">
      <section className="form-card" style={{ maxWidth: "28rem", paddingTop: "var(--space-4)" }}>
        <Suspense fallback={<SignupFallback />}>
          <SignupPageContent />
        </Suspense>
      </section>
    </div>
  );
}
