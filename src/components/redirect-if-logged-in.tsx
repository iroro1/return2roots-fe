"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, type ReactNode } from "react";

type RedirectIfLoggedInProps = {
  children: ReactNode;
  fallback?: ReactNode;
  /** Default redirect when logged in. Use "callbackUrl" to respect search param. */
  to?: string | "callbackUrl";
};

export function RedirectIfLoggedIn({
  children,
  fallback = null,
  to = "/profile",
}: RedirectIfLoggedInProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status !== "authenticated" || !session) return;
    const target =
      to === "callbackUrl"
        ? searchParams.get("callbackUrl") ?? "/profile"
        : to;
    router.replace(target);
  }, [status, session, to, router, searchParams]);

  if (status === "loading") {
    return <>{fallback}</>;
  }
  if (status === "authenticated") {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}
