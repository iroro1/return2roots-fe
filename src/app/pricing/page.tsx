import Link from "next/link";
import type { BreadcrumbItem } from "@/components/page-header";
import { PageHeader } from "@/components/page-header";
import { PageCTA } from "@/components/page-cta";
import { SUBSCRIPTION_PLANS } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & plans | Return to Roots",
  description:
    "Subscribe for cultural content, community access, exclusive events, and journey support. Explorer, Immersion, and Legacy plans.",
};

const breadcrumb: BreadcrumbItem[] = [
  { label: "Home", href: "/" },
  { label: "Pricing" },
];

export default function PricingPage() {
  return (
    <div className="shell page-inner">
      <section>
        <PageHeader
          breadcrumb={breadcrumb}
          pill="Membership"
          title="Choose your plan"
          intro="Get access to cultural content, community, exclusive events, and journey support. Cancel anytime."
        />

        <div className="plan-grid">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <Link
              key={plan.id}
              href={`/pricing/${plan.id}`}
              className={`plan-card card-link ${plan.highlighted ? "plan-card-highlighted" : ""}`}
            >
              {plan.highlighted ? (
                <span className="plan-card-badge">{plan.tagline}</span>
              ) : (
                <span className="muted plan-card-tagline">{plan.tagline}</span>
              )}
              <h2 className="heading-card plan-card-name">{plan.name}</h2>
              <p className="muted plan-card-desc">{plan.description}</p>
              <div className="plan-card-price">
                <span className="plan-card-amount">${plan.price}</span>
                <span className="muted plan-card-period">/{plan.period}</span>
              </div>
              <ul className="plan-card-features">
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <span className={plan.highlighted ? "btn btn-primary btn-lg plan-card-cta" : "btn btn-secondary plan-card-cta"}>
                View details →
              </span>
            </Link>
          ))}
        </div>

        <PageCTA
          text="Not sure which plan fits? We'll help you choose based on your goals."
          primary={{ href: "/request", label: "Contact us" }}
          secondary={[{ href: "/", label: "Back to home" }]}
          className="cta-block"
        />
      </section>
    </div>
  );
}
