"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";

const links = [
  { href: "/learn", label: "Learn" },
  { href: "/pricing", label: "Pricing" },
  { href: "/long-term", label: "Long-term stay" },
] as const;

export function NavMoreDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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

  return (
    <div className="nav-more" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="nav-more-trigger"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="nav-more-menu"
      >
        More
        <span className="nav-more-chevron" aria-hidden="true">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 1l4 4 4-4" />
          </svg>
        </span>
      </button>
      {open && (
        <div id="nav-more-menu" className="nav-more-dropdown" role="menu">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-more-item"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
