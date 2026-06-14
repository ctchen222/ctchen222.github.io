import { getAllLetters, getAllPosts } from "@/lib/content";
import Link from "next/link";
import { ContentCardGrid } from "@/components/content-card-grid";

export default async function HomePage() {
  const posts = await getAllPosts();
  const letters = await getAllLetters();
  const latestPosts = posts.slice(0, 6);
  const latestLetters = letters.slice(0, 3);

  return (
    <div className="post-grid">
      <section className="post-section intro-section">
        <p>
          Software engineer writing about backend systems, developer workflow,
          and the day-to-day work of building useful software.
        </p>
      </section>

      <section className="post-section">
        <h1>Blog</h1>
        <ContentCardGrid
          items={latestPosts.map((post) => ({
            href: `/posts/${post.slug}/`,
            title: post.title,
            date: post.date,
            description: post.excerpt,
            tone: "article",
          }))}
        />
        <Link href="/articles/" className="more-link">
          Older Posts <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className="post-section">
        <h2>Letters</h2>
        {latestLetters.length > 0 ? (
          <ContentCardGrid
            items={latestLetters.map((letter) => ({
              href: `/letters/${letter.slug}/`,
              title: letter.title,
              date: letter.date,
              description: "A shorter note from the working journal.",
              tone: "letter",
            }))}
          />
        ) : (
          <p className="empty-state">No letters published yet.</p>
        )}
        <Link href="/letter/" className="more-link">
          All Letters <span aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  );
}
