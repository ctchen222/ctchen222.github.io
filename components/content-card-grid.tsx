import Link from "next/link";

type ContentCard = {
  href: string;
  title: string;
  date?: string;
  description?: string;
  tone: "article" | "letter";
};

const toneLabels: Record<ContentCard["tone"], string> = {
  article: "Article",
  letter: "Letter",
};

export function ContentCardGrid({ items }: { items: ContentCard[] }) {
  return (
    <div className="card-grid">
      {items.map((item, index) => (
        <article
          className="content-card"
          data-tone={item.tone}
          key={`${item.href}-${index}`}
        >
          <Link href={item.href} className="content-card-media" aria-label={item.title}>
            <span className="content-card-label">{toneLabels[item.tone]}</span>
          </Link>
          <div className="content-card-body">
            {item.date ? <time className="content-card-date">{item.date}</time> : null}
            <h2 className="content-card-title">
              <Link href={item.href}>{item.title}</Link>
            </h2>
            {item.description ? (
              <p className="content-card-description">{item.description}</p>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
