import type { Metadata } from "next";
import { getAllPosts } from "@/lib/content";
import { config } from "@/lib/config";
import { ContentCardGrid } from "@/components/content-card-grid";

export const metadata: Metadata = {
  title: `Blog — ${config.siteTitle}`,
};

export default async function ArticlesPage() {
  const posts = await getAllPosts();

  return (
    <div className="post-grid">
      <section className="post-section intro-section">
        <p>
          Personal writing on software engineering, developer tools, and work
          that benefits from thinking in public.
        </p>
      </section>
      <section className="post-section">
        <h1>Blog</h1>
        <ContentCardGrid
          items={posts.map((post) => ({
            href: `/posts/${post.slug}/`,
            title: post.title,
            date: post.date,
            description: post.excerpt,
            tone: "article",
          }))}
        />
      </section>
    </div>
  );
}
