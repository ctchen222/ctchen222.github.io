import type { Metadata } from "next";
import { getAllLetters } from "@/lib/content";
import { config } from "@/lib/config";
import { ContentCardGrid } from "@/components/content-card-grid";

export const metadata: Metadata = {
  title: `Letters — ${config.siteTitle}`,
};

export default async function LetterIndexPage() {
  const letters = await getAllLetters();

  return (
    <div className="post-grid">
      <section className="post-section intro-section">
        <p>Short notes, updates, and smaller pieces that do not need a full article.</p>
      </section>
      <section className="post-section">
        <h1>Letters</h1>
        {letters.length > 0 ? (
          <ContentCardGrid
            items={letters.map((letter) => ({
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
      </section>
    </div>
  );
}
