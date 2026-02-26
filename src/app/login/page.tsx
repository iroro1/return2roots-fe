import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginPageContent } from "@/components/login-page-content";

export const metadata: Metadata = {
  title: "Log in | Return to Roots",
  description: "Sign in to manage your profile and journey inquiries.",
};

function LoginFallback() {
  return (
    <div className="form-card" style={{ paddingTop: "var(--space-4)" }}>
      <p className="muted">Loading…</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="shell page-inner">
      <section className="form-card" style={{ paddingTop: "var(--space-4)" }}>
        <Suspense fallback={<LoginFallback />}>
          <LoginPageContent />
        </Suspense>
      </section>
    </div>
  );
}
