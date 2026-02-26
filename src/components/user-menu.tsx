"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useRef, useEffect, useState } from "react";
import { getInitials } from "@/lib/initials";
import type { ProfileExtension } from "@/lib/profile-store";

function SignOutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export function UserMenu() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileExtension | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const isMyPosts = pathname === "/community" && searchParams.get("mine") === "1";
  const isFollowing = pathname === "/community" && searchParams.get("feed") === "following";

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : { profile: null }))
      .then((d: { profile: ProfileExtension | null }) => setProfile(d.profile ?? null))
      .catch(() => setProfile(null));
  }, [session?.user?.id]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (status === "loading") {
    return (
      <span className="user-menu-loading" aria-hidden="true">
        …
      </span>
    );
  }

  if (!session?.user) return null;

  const user = session.user;
  const displayName = profile?.displayName ?? user.name ?? user.email?.split("@")[0] ?? "Account";
  const initial = getInitials(displayName, user.email);
  const avatarUrl = profile?.imageUrl;

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="user-menu-trigger"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="user-menu-dropdown"
        id="user-menu-button"
      >
        <span className="user-menu-avatar" aria-hidden="true">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="" width={32} height={32} className="user-menu-avatar-img" unoptimized />
          ) : (
            initial
          )}
        </span>
        <span className="user-menu-trigger-name">{displayName}</span>
        <span className={`user-menu-chevron ${open ? "user-menu-chevron-open" : ""}`} aria-hidden="true">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 1l4 4 4-4" />
          </svg>
        </span>
      </button>

      {open && (
        <div
          id="user-menu-dropdown"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
          className="user-menu-dropdown"
        >
          <div className="user-menu-head">
            <span className="user-menu-avatar user-menu-avatar-lg" aria-hidden="true">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="" width={40} height={40} className="user-menu-avatar-img" unoptimized />
              ) : (
                initial
              )}
            </span>
            <div className="user-menu-info">
              <span className="user-menu-name">{displayName}</span>
              <span className="user-menu-email">{user.email}</span>
            </div>
          </div>
          <div className="user-menu-divider" />
          <div className="user-menu-items">
            <Link
              href="/profile"
              className={`user-menu-item ${pathname === "/profile" ? "user-menu-item-active" : ""}`}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/request"
              className={`user-menu-item ${pathname === "/request" ? "user-menu-item-active" : ""}`}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              Journey inquiry
            </Link>
            <Link
              href="/community"
              className={`user-menu-item ${pathname === "/community" && !isMyPosts && !isFollowing ? "user-menu-item-active" : ""}`}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              Community
            </Link>
            <Link
              href="/community?feed=following"
              className={`user-menu-item ${isFollowing ? "user-menu-item-active" : ""}`}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              Following
            </Link>
            <Link
              href="/community?mine=1"
              className={`user-menu-item ${isMyPosts ? "user-menu-item-active" : ""}`}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              My posts
            </Link>
            <div className="user-menu-divider" />
            <button
              type="button"
              className="user-menu-item user-menu-item-signout"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/" });
              }}
            >
              <span className="user-menu-item-icon">
                <SignOutIcon />
              </span>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
