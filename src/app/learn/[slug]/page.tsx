import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { BreadcrumbItem } from "@/components/page-header";
import { PageHeader } from "@/components/page-header";
import { PageCTA } from "@/components/page-cta";
import { getContentBySlug, getAllContentSlugs } from "@/lib/data";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllContentSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getContentBySlug(slug);
  if (!item) return { title: "Article | Return to Roots" };
  return {
    title: `${item.title} | Return to Roots`,
    description: item.excerpt,
  };
}

export default async function LearnDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getContentBySlug(slug);
  if (!item) notFound();

  const breadcrumb: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Learn", href: "/learn" },
    { label: item.title },
  ];

  return (
    <div className="shell page-inner">
      <article className="content-detail">
        <PageHeader
          breadcrumb={breadcrumb}
          pill={item.theme}
          title={item.title}
          intro={item.excerpt}
        />

        <div className="content-detail-hero">
          <div className="content-detail-image">
            <Image
              src={item.image}
              alt={item.imageAlt}
              width={1200}
              height={600}
              sizes="(max-width: 900px) 100vw, 1100px"
              priority
            />
          </div>
          <div className="content-detail-meta">
            <span className="content-detail-read">{item.readTime}</span>
            <span className="content-detail-region">{item.region}</span>
          </div>
        </div>

        <div className="content-detail-body">
          <p className="content-detail-paragraph">{item.body}</p>
        </div>

        <div className="content-detail-cta">
          <PageCTA
            text="Explore more articles or start your journey."
            primary={{ href: "/learn", label: "All articles" }}
            secondary={[
              { href: "/experiences", label: "Journeys" },
              { href: "/request", label: "Start your journey" },
            ]}
          />
        </div>
      </article>
    </div>
  );
}
