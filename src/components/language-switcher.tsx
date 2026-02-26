"use client";

import { useCallback, useEffect, useState } from "react";

const LOCALE_KEY = "return2roots_locale";
type Locale = "en" | "fr";

export function LanguageSwitcher() {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(LOCALE_KEY) as Locale | null;
    if (stored === "en" || stored === "fr") {
      setLocaleState(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.documentElement.lang = next;
    if (typeof window !== "undefined") localStorage.setItem(LOCALE_KEY, next);
  }, []);

  if (!mounted) return null;

  return (
    <div className="language-switcher" role="group" aria-label="Language">
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`language-switcher-btn ${locale === "en" ? "language-switcher-btn-active" : ""}`}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
      <span className="language-switcher-sep" aria-hidden="true">|</span>
      <button
        type="button"
        onClick={() => setLocale("fr")}
        className={`language-switcher-btn ${locale === "fr" ? "language-switcher-btn-active" : ""}`}
        aria-pressed={locale === "fr"}
      >
        FR
      </button>
    </div>
  );
}
