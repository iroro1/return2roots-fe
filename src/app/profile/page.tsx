"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { getInitials } from "@/lib/initials";
import type { StoredInquiry } from "@/lib/inquiries-store";
import type { ProfileExtension } from "@/lib/profile-store";
import { EXPERIENCES } from "@/lib/data";

function SignOutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function formatInquiryDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function journeyTitle(slug?: string) {
  if (!slug) return null;
  const exp = EXPERIENCES.find((e) => e.slug === slug || e.id === slug);
  return exp?.title ?? slug;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [myInquiries, setMyInquiries] = useState<StoredInquiry[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileExtension | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editOrigin, setEditOrigin] = useState("");
  const [editInterests, setEditInterests] = useState("");
  const [editLanguage, setEditLanguage] = useState<"en" | "fr">("en");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : { profile: null }))
      .then((d: { profile: ProfileExtension | null }) => {
        setProfile(d.profile ?? null);
      })
      .catch(() => setProfile(null))
      .finally(() => setProfileLoading(false));
  }, [status, session?.user]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;
    fetch("/api/inquiries/mine")
      .then((r) => r.ok ? r.json() : { inquiries: [] })
      .then((d: { inquiries: StoredInquiry[] }) => setMyInquiries(d.inquiries ?? []))
      .catch(() => setMyInquiries([]))
      .finally(() => setInquiriesLoading(false));
  }, [status, session?.user]);

  useEffect(() => {
    if (profileLoading) return;
    setEditDisplayName(profile?.displayName ?? session?.user?.name ?? "");
    setEditOrigin(profile?.origin ?? "");
    setEditInterests(profile?.interests ?? "");
    setEditLanguage(profile?.language ?? "en");
  }, [profile, profileLoading, session?.user?.name]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setUploadError(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    if (file) {
      if (!file.type.startsWith("image/")) {
        setUploadError("Please choose an image (JPEG, PNG, WebP or GIF).");
        setPhotoFile(null);
        setPhotoPreview(null);
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        setUploadError("Image must be under 4MB.");
        setPhotoFile(null);
        setPhotoPreview(null);
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setPhotoFile(null);
      setPhotoPreview(null);
    }
  }

  async function handleSave() {
    if (!session?.user || saving) return;
    setSaving(true);
    setUploadError(null);
    try {
      let imageUrl = profile?.imageUrl;
      if (photoFile) {
        setUploading(true);
        const form = new FormData();
        form.append("file", photoFile);
        const up = await fetch("/api/upload", { method: "POST", body: form });
        const upData = await up.json().catch(() => ({})) as { url?: string; error?: string };
        if (!up.ok) {
          setUploadError(upData.error ?? "Upload failed. Try a smaller image (under 4MB).");
          setSaving(false);
          setUploading(false);
          return;
        }
        imageUrl = upData.url ?? undefined;
        setUploading(false);
        setPhotoFile(null);
        if (photoPreview) URL.revokeObjectURL(photoPreview);
        setPhotoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: editDisplayName.trim() || undefined,
          origin: editOrigin.trim() || undefined,
          interests: editInterests.trim() || undefined,
          language: editLanguage,
          imageUrl: imageUrl ?? null,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { profile: ProfileExtension };
        setProfile(data.profile);
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading" || !session) {
    return (
      <div className="shell page-inner" style={{ minHeight: "40vh" }}>
        <div className="profile-loading">
          <div className="profile-avatar-skeleton" />
          <div className="profile-name-skeleton" />
          <div className="profile-email-skeleton" />
        </div>
      </div>
    );
  }

  const user = session.user;
  const displayName = profile?.displayName ?? user?.name ?? "Account";
  const avatarUrl = profile?.imageUrl;
  const initial = getInitials(displayName, user?.email);

  return (
    <div className="shell page-inner">
      <Link href="/" className="profile-back">
        ← Back to home
      </Link>
      <div className="profile-hero">
        <div className="profile-avatar">
          {avatarUrl ? (
            <span className="profile-avatar-inner profile-avatar-img-wrap">
              <Image src={avatarUrl} alt="" width={88} height={88} className="profile-avatar-img" unoptimized />
            </span>
          ) : (
            <span className="profile-avatar-inner" aria-hidden="true">
              {initial}
            </span>
          )}
        </div>
        <h1 className="profile-name">{displayName}</h1>
        <p className="profile-email">{user?.email}</p>
        {user?.id && (
          <Link href={`/people/${encodeURIComponent(user.id)}`} className="profile-view-public">
            View my public profile
          </Link>
        )}
      </div>

      <section className="profile-section">
        <h2 className="profile-section-title">Profile</h2>
        <p className="profile-section-desc muted">
          Your display name, photo, origin, and interests are visible to the community. Edit below to update your public profile.
        </p>
        <div className={`profile-account-card ${editing ? "profile-edit-card" : ""}`}>
          {editing ? (
            <div className="profile-edit-inner">
              <div className="profile-edit-photo-block">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handlePhotoChange}
                  className="profile-photo-input-hidden"
                  aria-label="Upload profile photo"
                />
                <button
                  type="button"
                  className="profile-edit-avatar-wrap"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="profile-edit-avatar-img object-cover" />
                  ) : profile?.imageUrl ? (
                    <Image src={profile.imageUrl} alt="" width={120} height={120} className="profile-edit-avatar-img object-cover" unoptimized={false} />
                  ) : (
                    <span className="profile-edit-avatar-initials">{getInitials(editDisplayName || user?.name, user?.email)}</span>
                  )}
                  <span className="profile-edit-avatar-overlay">
                    {uploading ? "Uploading…" : "Change photo"}
                  </span>
                </button>
                <p className="profile-edit-photo-hint">Click to upload · JPEG, PNG, WebP or GIF · Max 4MB</p>
                {uploadError && <p className="profile-edit-error" role="alert">{uploadError}</p>}
              </div>
              <div className="profile-edit-fields">
                <div className="form-field">
                  <label htmlFor="profile-display-name" className="form-label">Display name</label>
                  <input
                    id="profile-display-name"
                    type="text"
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    className="form-input"
                    placeholder={user?.name ?? user?.email ?? "Your name"}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="profile-origin" className="form-label">Origin / heritage</label>
                  <input
                    id="profile-origin"
                    type="text"
                    value={editOrigin}
                    onChange={(e) => setEditOrigin(e.target.value)}
                    className="form-input"
                    placeholder="e.g. Ghana, Nigeria, Caribbean"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="profile-interests" className="form-label">Interests</label>
                  <input
                    id="profile-interests"
                    type="text"
                    value={editInterests}
                    onChange={(e) => setEditInterests(e.target.value)}
                    className="form-input"
                    placeholder="e.g. Language, heritage sites, kente"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="profile-language" className="form-label">Preferred language</label>
                  <select
                    id="profile-language"
                    value={editLanguage}
                    onChange={(e) => setEditLanguage(e.target.value as "en" | "fr")}
                    className="form-input form-select"
                  >
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
                <div className="profile-edit-actions">
                  <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving || uploading}>
                    {saving ? (uploading ? "Uploading…" : "Saving…") : "Save changes"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => { setEditing(false); setPhotoFile(null); setUploadError(null); if (photoPreview) URL.revokeObjectURL(photoPreview); setPhotoPreview(null); }}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="profile-account-row">
                <span className="profile-account-label">Display name</span>
                <span className="profile-account-value">{displayName}</span>
              </div>
              <div className="profile-account-row">
                <span className="profile-account-label">Email</span>
                <span className="profile-account-value">{user?.email ?? "—"}</span>
              </div>
              <div className="profile-account-row">
                <span className="profile-account-label">Origin / heritage</span>
                <span className="profile-account-value">{profile?.origin || "—"}</span>
              </div>
              <div className="profile-account-row">
                <span className="profile-account-label">Interests</span>
                <span className="profile-account-value">{profile?.interests || "—"}</span>
              </div>
              <div className="profile-account-row">
                <span className="profile-account-label">Preferred language</span>
                <span className="profile-account-value">{profile?.language === "fr" ? "Français" : "English"}</span>
              </div>
              <div className="profile-edit-row">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
                  Edit profile
                </button>
                {user?.id && (
                  <Link href={`/people/${encodeURIComponent(user.id)}`} className="btn btn-ghost btn-sm">
                    View as others see
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="profile-section">
        <h2 className="profile-section-title">Your inquiries</h2>
        {inquiriesLoading ? (
          <p className="muted" style={{ margin: 0 }}>Loading…</p>
        ) : myInquiries.length === 0 ? (
          <div className="profile-account-card">
            <p className="muted" style={{ margin: 0 }}>
              You haven&apos;t submitted any journey inquiries yet.{" "}
              <Link href="/request" style={{ color: "var(--color-accent)", fontWeight: 600 }}>
                Submit your first inquiry
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="profile-inquiry-list">
            {myInquiries.map((inq) => (
              <div key={inq.id} className="profile-inquiry-item">
                <div className="profile-inquiry-item-meta">
                  <span className="profile-inquiry-item-journey">
                    {journeyTitle(inq.journey) ?? "General inquiry"}
                  </span>
                  <span className="profile-inquiry-item-date">{formatInquiryDate(inq.createdAt)}</span>
                </div>
                <p className="profile-inquiry-item-message">{inq.message}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="profile-section">
        <h2 className="profile-section-title">Quick actions</h2>
        <div className="profile-actions">
          <Link href="/request" className="profile-action-card profile-action-primary">
            <div className="profile-action-content">
              <span className="profile-action-label">Journey inquiry</span>
              <span className="profile-action-desc">Submit your interest for a cultural immersion journey</span>
            </div>
            <span className="profile-action-arrow" aria-hidden="true">→</span>
          </Link>
          <Link href="/experiences" className="profile-action-card">
            <div className="profile-action-content">
              <span className="profile-action-label">Browse journeys</span>
              <span className="profile-action-desc">Explore curated experiences in Ghana</span>
            </div>
            <span className="profile-action-arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <div className="profile-signout-wrap">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="profile-signout"
        >
          <span className="profile-signout-icon">
            <SignOutIcon />
          </span>
          Sign out
        </button>
      </div>
    </div>
  );
}
