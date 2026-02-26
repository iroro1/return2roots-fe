"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  EXPERIENCES,
  DURATION_FILTERS,
  REGION_FILTERS,
  filterExperiences,
  type DurationFilter,
  type RegionFilter,
} from "@/lib/data";

export function JourneyCatalog() {
  const [duration, setDuration] = useState<DurationFilter>("all");
  const [region, setRegion] = useState<RegionFilter>("all");
  const filtered = filterExperiences(duration, region);

  return (
    <>
      <div className="journey-filters">
        <div className="journey-filter-group">
          <label htmlFor="filter-duration" className="journey-filter-label">
            Duration
          </label>
          <select
            id="filter-duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value as DurationFilter)}
            className="form-input form-select journey-filter-select"
          >
            {DURATION_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div className="journey-filter-group">
          <label htmlFor="filter-region" className="journey-filter-label">
            Region
          </label>
          <select
            id="filter-region"
            value={region}
            onChange={(e) => setRegion(e.target.value as RegionFilter)}
            className="form-input form-select journey-filter-select"
          >
            {REGION_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <p className="journey-filter-count muted">
          {filtered.length} {filtered.length === 1 ? "journey" : "journeys"}
        </p>
      </div>

      <div className="grid grid-2 journey-grid-reveal" style={{ gap: "var(--space-10)", marginBottom: "var(--space-14)" }}>
        {filtered.map((exp, i) => (
          <Link
            key={exp.id}
            href={`/experiences/${exp.slug}`}
            className={`journey-card journey-theme-${exp.theme} card-link journey-card-reveal`}
            style={{ animationDelay: `${i * 80}ms` } as React.CSSProperties}
          >
            <div className="journey-card-image">
              <Image
                src={exp.image}
                alt={exp.imageAlt}
                width={600}
                height={375}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="journey-card-overlay" aria-hidden="true" />
              <div className="journey-card-meta">
                <div className="journey-card-meta-top">
                  <span className="location">{exp.location}</span>
                  <span className="journey-card-price">{exp.priceRange}</span>
                </div>
                <h2 className="title">{exp.title}</h2>
                <div className="duration">{exp.duration}</div>
              </div>
            </div>
            <div className="journey-card-body">
              <p className="journey-card-tagline">&ldquo;{exp.tagline}&rdquo;</p>
              <p className="muted journey-card-focus">{exp.focus}</p>
              <div className="journey-chips" style={{ marginBottom: "var(--space-5)" }}>
                {exp.highlights.map((h) => (
                  <span key={h} className="journey-chip">
                    {h}
                  </span>
                ))}
              </div>
              <span className="journey-card-cta">Explore this journey →</span>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="journey-empty">
          <p className="muted">No journeys match these filters. Try different duration or region.</p>
        </div>
      )}
    </>
  );
}
