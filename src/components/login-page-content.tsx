"use client";

import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";
import { RedirectIfLoggedIn } from "@/components/redirect-if-logged-in";

function LoginFallback() {
  return (
    <div className="form-card" style={{ paddingTop: "var(--space-4)" }}>
      <p className="muted">Loading…</p>
    </div>
  );
}

export function LoginPageContent() {
  return (
    <RedirectIfLoggedIn fallback={<LoginFallback />} to="callbackUrl">
      <nav aria-label="Breadcrumb" className="breadcrumb muted">
        <span><Link href="/">Home</Link></span>
        <span className="breadcrumb-sep" aria-hidden="true">/</span>
        <span aria-current="page">Log in</span>
      </nav>
      <span className="pill">Account</span>
      <h1 className="heading-hero page-title">Log in</h1>
      <p className="muted" style={{ marginBottom: "var(--space-6)", fontSize: "var(--text-base)" }}>
        Sign in to manage your profile, preferences, and journey inquiries.
      </p>
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
      <p className="muted" style={{ marginTop: "var(--space-6)", fontSize: "var(--text-sm)", textAlign: "center" }}>
        Don&apos;t have an account?{" "}
        <Link href="/signup" style={{ fontWeight: 600, color: "var(--color-accent)" }}>Sign up</Link>
      </p>
    </RedirectIfLoggedIn>
  );
}
