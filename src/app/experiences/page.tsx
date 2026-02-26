import Link from "next/link";
import type { BreadcrumbItem } from "@/components/page-header";
import { PageHeader } from "@/components/page-header";
import { PageCTA } from "@/components/page-cta";
import { JourneyCatalog } from "@/components/journey-catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journeys | Return to Roots",
  description:
    "Curated cultural immersion journeys in Ghana. Compare durations, locations, and what's included.",
};

const breadcrumb: BreadcrumbItem[] = [
  { label: "Home", href: "/" },
  { label: "Journeys" },
];

export default function ExperiencesPage() {
  return (
    <div className="shell page-inner">
      <section>
        <PageHeader
          breadcrumb={breadcrumb}
          pill="Journey catalog"
          title="Cultural immersion journeys"
          intro="Each journey is designed with elders, historians, and local coordinators—not tour operators. Filter by duration or region, then compare."
        />

        <JourneyCatalog />

        <PageCTA
          text="Not sure which journey fits? Share your dates and interests—we'll suggest the right one."
          primary={{ href: "/request", label: "Start your journey" }}
          secondary={[{ href: "/", label: "Back to home" }]}
          className="cta-block"
        />
      </section>
    </div>
  );
}
