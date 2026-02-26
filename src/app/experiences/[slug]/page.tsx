import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { BreadcrumbItem } from "@/components/page-header";
import { PageHeader } from "@/components/page-header";
import { PageCTA } from "@/components/page-cta";
import { getExperienceBySlug, getAllExperienceSlugs, getSimilarJourneys } from "@/lib/data";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllExperienceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const journey = getExperienceBySlug(slug);
  if (!journey) return { title: "Journey | Return to Roots" };
  return {
    title: `${journey.title} | Return to Roots`,
    description: journey.description,
  };
}

export default async function JourneyDetailPage({ params }: Props) {
  const { slug } = await params;
  const journey = getExperienceBySlug(slug);
  if (!journey) notFound();

  const similar = getSimilarJourneys(journey, 2);
  const breadcrumb: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Journeys", href: "/experiences" },
    { label: journey.title },
  ];

  return (
    <div className="shell page-inner">
      <article className={`journey-detail journey-theme-${journey.theme}`}>
        <PageHeader
          breadcrumb={breadcrumb}
          pill={journey.location}
          title={journey.title}
          intro={journey.tagline}
        />

        <div className="journey-detail-hero">
          <div className="journey-detail-image">
            <Image
              src={journey.image}
              alt={journey.imageAlt}
              width={1200}
              height={600}
              sizes="(max-width: 900px) 100vw, 1100px"
              priority
            />
            <div className="journey-detail-overlay" aria-hidden="true" />
            <div className="journey-detail-meta">
              <span className="journey-detail-duration">{journey.duration}</span>
              <span className="journey-detail-focus">{journey.focus}</span>
            </div>
          </div>
        </div>

        <div className="journey-detail-keyinfo">
          <span className="journey-detail-keyinfo-item">
            <span className="journey-detail-keyinfo-label">Price</span>
            <span className="journey-detail-keyinfo-value">{journey.priceRange}</span>
          </span>
          <span className="journey-detail-keyinfo-item">
            <span className="journey-detail-keyinfo-label">Duration</span>
            <span className="journey-detail-keyinfo-value">{journey.duration}</span>
          </span>
          <span className="journey-detail-keyinfo-item">
            <span className="journey-detail-keyinfo-label">Best time</span>
            <span className="journey-detail-keyinfo-value">{journey.bestTime}</span>
          </span>
          <div className="journey-detail-keyinfo-item journey-detail-keyinfo-bestfor">
            <span className="journey-detail-keyinfo-label">Ideal for</span>
            <span className="journey-detail-keyinfo-value">
              {journey.bestFor.join(" · ")}
            </span>
          </div>
        </div>

        <div className="journey-detail-body">
          <p className="journey-detail-description">{journey.description}</p>

          <section className="journey-detail-section" aria-labelledby="highlights-heading">
            <h2 id="highlights-heading" className="journey-detail-heading">
              Highlights
            </h2>
            <ul className="journey-detail-list">
              {journey.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </section>

          <section className="journey-detail-section" aria-labelledby="included-heading">
            <h2 id="included-heading" className="journey-detail-heading">
              What&apos;s included
            </h2>
            <ul className="journey-detail-list">
              {journey.included.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </section>

          <div className="journey-detail-cta journey-detail-cta-sticky">
            <PageCTA
              text="Ready to start? Share your preferred dates and we'll guide you through next steps."
              primary={{ href: `/request?journey=${journey.id}`, label: "Inquire about this journey" }}
              secondary={[
                { href: "/experiences", label: "All journeys" },
                { href: "/", label: "Home" },
              ]}
            />
          </div>

          {similar.length > 0 && (
            <section className="journey-detail-section" aria-labelledby="similar-heading">
              <h2 id="similar-heading" className="journey-detail-heading">
                Similar journeys
              </h2>
              <div className="journey-similar-grid">
                {similar.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/experiences/${s.slug}`}
                    className={`journey-similar-card journey-theme-${s.theme}`}
                  >
                    <div className="journey-similar-image">
                      <Image
                        src={s.image}
                        alt={s.imageAlt}
                        width={400}
                        height={220}
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                      <div className="journey-similar-overlay" aria-hidden="true" />
                    </div>
                    <div className="journey-similar-body">
                      <span className="journey-similar-location">{s.location}</span>
                      <h3 className="journey-similar-title">{s.title}</h3>
                      <span className="journey-similar-duration">{s.duration}</span>
                      <span className="journey-similar-cta">View journey →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </div>
  );
}
