import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllLetters, getLetterBySlug } from "@/lib/content";
import { config } from "@/lib/config";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const letters = await getAllLetters();
  return letters.map((letter) => ({ slug: letter.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const letter = await getLetterBySlug(slug);
  if (!letter) return {};
  return {
    title: `${letter.title} — ${config.siteTitle}`,
  };
}

export default async function LetterPage({ params }: Props) {
  const { slug } = await params;
  const letter = await getLetterBySlug(slug);
  if (!letter) notFound();

  return (
    <article className="article-shell">
      <p className="entry-date">{letter.date}</p>
      <h1 className="article-title">{letter.title}</h1>
      <p className="article-meta">{config.author}</p>
      <div
        className="post-body article-body"
        dangerouslySetInnerHTML={{ __html: letter.html }}
      />
      <p className="back-link-wrap">
        <Link href="/letter/" className="more-link">
          ← Back to letters
        </Link>
      </p>
    </article>
  );
}
