import Link from "next/link";

export type BreadcrumbItem = { label: string; href?: string };

type PageHeaderProps = {
  breadcrumb: BreadcrumbItem[];
  pill: string;
  title: string;
  intro?: string;
  /** Extra class for section intro when centering (e.g. testimonials) */
  introClassName?: string;
};

export function PageHeader({ breadcrumb, pill, title, intro, introClassName }: PageHeaderProps) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="breadcrumb">
        {breadcrumb.map((item, i) => (
          <span key={i}>
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
            {i < breadcrumb.length - 1 && <span className="breadcrumb-sep" aria-hidden="true">/</span>}
          </span>
        ))}
      </nav>
      <span className="pill">{pill}</span>
      <h1 className="heading-hero page-title">{title}</h1>
      {intro && (
        <p className={`muted section-intro ${introClassName ?? ""}`}>
          {intro}
        </p>
      )}
    </>
  );
}
