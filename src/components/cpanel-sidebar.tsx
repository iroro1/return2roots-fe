"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/cpanel", label: "Overview" },
  { href: "/cpanel/requests", label: "Journey inquiries" },
  { href: "/cpanel/sourcers", label: "Sourcers" },
  { href: "/cpanel/payments", label: "Payments" },
] as const;

export function CpanelSidebar() {
  const pathname = usePathname();

  return (
    <aside className="cpanel-sidebar">
      <h2>Admin</h2>
      <nav className="cpanel-nav" aria-label="Admin">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            data-active={pathname === link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
