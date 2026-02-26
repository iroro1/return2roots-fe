"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserMenu } from "@/components/user-menu";

export function HeaderAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <span className="header-auth-loading" aria-hidden="true">
        …
      </span>
    );
  }

  if (session?.user) {
    return (
      <div className="header-auth">
        <UserMenu />
      </div>
    );
  }

  return (
    <div className="header-auth">
      <Link href="/login" className="nav-link">
        Log in
      </Link>
      <Link href="/signup" className="btn btn-primary btn-sm">
        Sign up
      </Link>
    </div>
  );
}
