import Link from "next/link";
import type { BreadcrumbItem } from "@/components/page-header";
import { PageHeader } from "@/components/page-header";
import { PageCTA } from "@/components/page-cta";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Long-term stay & residency | Return to Roots",
  description:
    "Explore long-term stays and residency options in Ghana. Information, consultation, and support for the diaspora.",
};

const breadcrumb: BreadcrumbItem[] = [
  { label: "Home", href: "/" },
  { label: "Long-term stay & residency" },
];

export default function LongTermPage() {
  return (
    <div className="shell page-inner">
      <section>
        <PageHeader
          breadcrumb={breadcrumb}
          pill="Beyond the journey"
          title="Long-term stay & residency"
          intro="Considering a longer stay or residency in Ghana? We provide information and guided consultation—so you can explore options with clarity."
        />

        <div className="long-term-content">
          <div className="grid grid-2" style={{ gap: "var(--space-10)", marginBottom: "var(--space-16)" }}>
            <article className="card card-elevated" style={{ padding: "var(--space-8)" }}>
              <span className="section-label">Overview</span>
              <h2 className="heading-card" style={{ marginTop: "var(--space-2)" }}>
                Long-term stays
              </h2>
              <p className="muted" style={{ margin: 0 }}>
                Many of our community members extend their 2–4 week journey into months. We can connect you with trusted partners for housing, local coordinators, and ongoing cultural integration—so your transition feels supported, not overwhelming.
              </p>
            </article>
            <article className="card card-elevated" style={{ padding: "var(--space-8)" }}>
              <span className="section-label">Residency</span>
              <h2 className="heading-card" style={{ marginTop: "var(--space-2)" }}>
                Residency assistance
              </h2>
              <p className="muted" style={{ margin: 0 }}>
                Ghana offers pathways for diaspora and investors. We don&apos;t process applications ourselves—we provide clear information, documentation overviews, and can refer you to vetted legal and immigration partners when you&apos;re ready.
              </p>
            </article>
          </div>

          <div className="card" style={{ padding: "var(--space-8)", marginBottom: "var(--space-12)", borderLeft: "4px solid var(--color-accent)" }}>
            <h2 className="heading-card" style={{ marginTop: 0 }}>What we offer</h2>
            <ul className="journey-detail-list" style={{ marginBottom: 0 }}>
              <li>Information on visa extensions and long-term stay options</li>
              <li>Overview of residency pathways (e.g. Right of Abode, investor options)</li>
              <li>Referrals to vetted legal and immigration professionals</li>
              <li>Ongoing community and cultural support for members</li>
            </ul>
          </div>

          <PageCTA
            text="Ready to explore? Request a consultation and we'll guide you through next steps."
            primary={{ href: "/request?type=residency", label: "Request residency consultation" }}
            secondary={[
              { href: "/experiences", label: "Start with a journey" },
              { href: "/", label: "Back to home" },
            ]}
            className="cta-block"
          />
        </div>
      </section>
    </div>
  );
}
