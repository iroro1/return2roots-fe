"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        name: name.trim() || undefined,
        redirect: false,
      });
      if (res?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }
      window.location.href = "/profile";
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="signup-name" className="form-label">Name</label>
          <input
            id="signup-name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="Your name"
          />
        </div>
        <div className="form-field">
          <label htmlFor="signup-email" className="form-label">Email</label>
          <input
            id="signup-email"
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
        <div className="form-field">
          <label htmlFor="signup-password" className="form-label">Password</label>
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
          <Link href="/" className="btn btn-ghost">Cancel</Link>
        </div>
      </form>

      <p className="muted" style={{ marginTop: "var(--space-8)", fontSize: "var(--text-sm)" }}>
        Demo: use any email and any password to create an account.
      </p>
      <p style={{ marginTop: "var(--space-3)", fontSize: "var(--text-sm)" }}>
        <Link href="/login" style={{ color: "var(--color-accent)", fontWeight: 600 }}>
          Already have an account? Log in
        </Link>
      </p>
    </>
  );
}
