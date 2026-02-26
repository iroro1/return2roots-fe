"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { BreadcrumbItem } from "@/components/page-header";
import { PageHeader } from "@/components/page-header";
import { PageCTA } from "@/components/page-cta";
import { CULTURAL_CONTENT, CONTENT_THEMES, type ContentTheme } from "@/lib/data";

const breadcrumb: BreadcrumbItem[] = [
  { label: "Home", href: "/" },
  { label: "Learn" },
];

export default function LearnPage() {
  const [theme, setTheme] = useState<ContentTheme | "all">("all");
  const filtered = theme === "all"
    ? [...CULTURAL_CONTENT]
    : CULTURAL_CONTENT.filter((c) => c.theme === theme);

  return (
    <div className="shell page-inner">
      <section>
        <PageHeader
          breadcrumb={breadcrumb}
          pill="Cultural content"
          title="Learn before you go"
          intro="Articles and resources to help you connect with Ghanaian culture—authentic, not touristy. Tagged by theme and region."
        />

        <div className="journey-filters" style={{ marginBottom: "var(--space-8)" }}>
          <div className="journey-filter-group">
            <label htmlFor="filter-theme" className="journey-filter-label">Theme</label>
            <select
              id="filter-theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value as ContentTheme | "all")}
              className="form-input form-select journey-filter-select"
            >
              <option value="all">All themes</option>
              {CONTENT_THEMES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <p className="journey-filter-count muted">
            {filtered.length} {filtered.length === 1 ? "article" : "articles"}
          </p>
        </div>

        <div className="grid grid-2" style={{ gap: "var(--space-8)", marginBottom: "var(--space-14)" }}>
          {filtered.map((item) => (
            <Link key={item.id} href={`/learn/${item.slug}`} className="story-card card-link">
              <div className="story-card-image-link">
                <div className="story-card-image">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    width={600}
                    height={375}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
              <div className="story-card-body">
                <div className="story-card-meta">
                  <span className="pill story-card-tag">{item.theme}</span>
                  <span className="muted story-card-meta-secondary">{item.readTime}</span>
                </div>
                <h2 className="heading-card story-card-title">{item.title}</h2>
                <p className="muted story-card-excerpt">{item.excerpt}</p>
                <span className="story-card-tag story-card-cta-link" style={{ textTransform: "capitalize" }}>
                  Read article →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="journey-empty">
            <p className="muted">No articles match this theme. Try another filter.</p>
          </div>
        )}

        <PageCTA
          text="Ready to experience it in person? Start with a journey or request a consultation."
          primary={{ href: "/request", label: "Start your journey" }}
          secondary={[
            { href: "/experiences", label: "Explore journeys" },
            { href: "/community", label: "Community stories" },
          ]}
          className="cta-block"
        />
      </section>
    </div>
  );
}
