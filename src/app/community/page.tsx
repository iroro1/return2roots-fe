import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import type { BreadcrumbItem } from "@/components/page-header";
import { PageHeader } from "@/components/page-header";
import { PageCTA } from "@/components/page-cta";
import { CommunityFeed } from "@/components/community-feed";
import { COMMUNITY_STORIES, COMMUNITY_MEMBERS } from "@/lib/data";
import { authOptions } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community | Return to Roots",
  description:
    "Connect with others on the journey. Share stories, post updates, and engage with the diaspora community.",
};

const breadcrumb: BreadcrumbItem[] = [
  { label: "Home", href: "/" },
  { label: "Community" },
];

export default async function CommunityPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="shell page-inner">
      <section>
        <PageHeader
          breadcrumb={breadcrumb}
          pill="Social"
          title="Community on the journey"
          intro="Share your experience, connect with others, and stay in the loop. Post updates, like, and comment when you're signed in."
        />

        <Suspense fallback={<p className="muted">Loading feed…</p>}>
          <CommunityFeed />
        </Suspense>

        {!session && (
        <div className="community-stories section-tight" style={{ paddingTop: "var(--space-16)" }}>
          <h2 className="heading-section" style={{ marginBottom: "var(--space-6)" }}>
            Stories from the journey
          </h2>
          <p className="muted" style={{ marginBottom: "var(--space-8)", maxWidth: "38rem" }}>
            First-hand accounts from members who&apos;ve completed Accra, Heritage, Roots, and other experiences.
          </p>
          <div className="grid grid-2" style={{ gap: "var(--space-8)" }}>
            {COMMUNITY_STORIES.map((s) => (
              <Link
                key={s.id}
                href={`/experiences/${s.journeySlug}`}
                className="story-card card-link"
              >
                <div className="story-card-image-link">
                  <div className="story-card-image">
                    <Image src={s.image} alt={s.title} width={600} height={375} sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                </div>
                <div className="story-card-body">
                  <div className="story-card-meta">
                    <Image src={s.avatar} alt="" width={40} height={40} className="avatar" />
                    <div>
                      <strong className="story-card-author">{s.author}</strong>
                      <span className="muted story-card-meta-secondary">{s.origin} · {s.date}</span>
                    </div>
                  </div>
                  <h3 className="heading-card story-card-title">{s.title}</h3>
                  <p className="muted story-card-excerpt">{s.excerpt}</p>
                  <div className="story-card-tags">
                    {s.tags.map((tag) => (
                      <span key={tag} className="pill story-card-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="story-card-journey-link">
                    Explore {s.journeyTitle} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        )}

        {!session && (
        <div className="community-members" style={{ marginBottom: "var(--space-12)" }}>
          <h2 className="heading-section" style={{ marginBottom: "var(--space-6)" }}>
            Members
          </h2>
          <p className="muted" style={{ marginBottom: "var(--space-6)", maxWidth: "38rem" }}>
            People who&apos;ve joined or completed a journey. Subscribe to see the full directory and connect.
          </p>
          <div className="grid grid-3" style={{ gap: "var(--space-6)" }}>
            {COMMUNITY_MEMBERS.map((m) => (
              <Link
                key={m.name}
                href={m.journeySlug ? `/experiences/${m.journeySlug}` : "/experiences"}
                className="card card-elevated card-hover member-card member-card-link"
              >
                <div className="member-card-row">
                  <Image src={m.avatar} alt="" width={56} height={56} className="avatar" />
                  <div className="member-card-info">
                    <strong className="member-card-name">{m.name}</strong>
                    <span className="muted member-card-location">{m.location}</span>
                    <span className="member-card-journey">{m.journey}</span>
                  </div>
                </div>
                <span className="member-card-cta">View journey →</span>
              </Link>
            ))}
          </div>
        </div>
        )}

        <PageCTA
          text="Join the community: get access to stories, members, and exclusive events. Or start your journey first."
          primary={{ href: "/request", label: "Start your journey" }}
          secondary={[
            { href: "/experiences", label: "Explore journeys" },
            { href: "/pricing", label: "View plans" },
          ]}
          className="cta-block"
        />
      </section>
    </div>
  );
}
