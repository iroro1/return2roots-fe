import Link from "next/link";
import { notFound } from "next/navigation";
import type { BreadcrumbItem } from "@/components/page-header";
import { PageHeader } from "@/components/page-header";
import { PageCTA } from "@/components/page-cta";
import { getPlanById, SUBSCRIPTION_PLANS } from "@/lib/data";
import type { Metadata } from "next";

type Props = { params: Promise<{ planId: string }> };

export async function generateStaticParams() {
  return SUBSCRIPTION_PLANS.map((plan) => ({ planId: plan.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { planId } = await params;
  const plan = getPlanById(planId);
  if (!plan) return { title: "Plan | Return to Roots" };
  return {
    title: `${plan.name} plan | Return to Roots`,
    description: plan.description,
  };
}

export default async function PlanDetailPage({ params }: Props) {
  const { planId } = await params;
  const plan = getPlanById(planId);
  if (!plan) notFound();

  const breadcrumb: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Pricing", href: "/pricing" },
    { label: plan.name },
  ];

  return (
    <div className="shell page-inner">
      <article className="plan-detail">
        <PageHeader
          breadcrumb={breadcrumb}
          pill={plan.tagline}
          title={plan.name}
          intro={plan.description}
        />

        <div className="plan-detail-price card" style={{ padding: "var(--space-8)", marginBottom: "var(--space-10)" }}>
          <span className="plan-card-amount">${plan.price}</span>
          <span className="muted plan-card-period">/{plan.period}</span>
        </div>

        <section className="plan-detail-features" aria-labelledby="plan-features-heading">
          <h2 id="plan-features-heading" className="heading-section" style={{ marginBottom: "var(--space-6)" }}>
            What&apos;s included
          </h2>
          <ul className="journey-detail-list">
            {plan.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>

        <div className="plan-detail-cta" style={{ marginTop: "var(--space-12)" }}>
          <PageCTA
            text="Start with this plan. You can change or cancel anytime."
            primary={{ href: "/request", label: plan.cta }}
            secondary={[
              { href: "/pricing", label: "All plans" },
              { href: "/", label: "Home" },
            ]}
          />
        </div>
      </article>
    </div>
  );
}
