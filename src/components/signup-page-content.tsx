"use client";

import Link from "next/link";
import { RedirectIfLoggedIn } from "@/components/redirect-if-logged-in";
import { SignupForm } from "@/components/signup-form";

function SignupFallback() {
  return (
    <div style={{ paddingTop: "var(--space-4)" }}>
      <p className="muted">Loading…</p>
    </div>
  );
}

export function SignupPageContent() {
  return (
    <RedirectIfLoggedIn fallback={<SignupFallback />} to="/profile">
      <nav aria-label="Breadcrumb" className="breadcrumb muted">
        <span><Link href="/">Home</Link></span>
        <span className="breadcrumb-sep" aria-hidden="true">/</span>
        <span aria-current="page">Sign up</span>
      </nav>
      <span className="pill">Account</span>
      <h1 className="heading-hero page-title">Create an account</h1>
      <p className="muted section-intro" style={{ marginBottom: "var(--space-6)" }}>
        Create an account to manage your profile, save journey preferences, and track inquiries.
      </p>
      <SignupForm />
      <p className="muted" style={{ marginTop: "var(--space-6)", fontSize: "var(--text-sm)", textAlign: "center" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ fontWeight: 600, color: "var(--color-accent)" }}>Log in</Link>
      </p>
    </RedirectIfLoggedIn>
  );
}
