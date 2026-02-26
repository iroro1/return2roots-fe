import Link from "next/link";

type PageCTAProps = {
  text?: string;
  primary: { href: string; label: string; external?: boolean };
  secondary?: { href: string; label: string }[];
  className?: string;
};

export function PageCTA({ text, primary, secondary, className }: PageCTAProps) {
  return (
    <div className={`page-cta ${className ?? ""}`}>
      {text && <p className="muted page-cta-text">{text}</p>}
      <div className="page-actions">
        {primary.external ? (
          <a href={primary.href} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
            {primary.label}
          </a>
        ) : (
          <Link href={primary.href} className="btn btn-primary btn-lg">
            {primary.label}
          </Link>
        )}
        {secondary?.map((s) => (
          <Link key={s.href} href={s.href} className="btn btn-ghost">
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
