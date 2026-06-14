import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { config } from "@/lib/config";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — ${config.siteTitle}`,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="article-shell">
      <p className="entry-date">{post.date}</p>
      <h1 className="article-title">{post.title}</h1>
      <p className="article-meta">{config.author}</p>
      <div
        className="post-body article-body"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      <p className="back-link-wrap">
        <Link href="/articles/" className="more-link">
          ← Back to blog
        </Link>
      </p>
    </article>
  );
}
