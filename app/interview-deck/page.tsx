import type { Metadata } from "next";
import { config } from "@/lib/config";
import { InterviewDeck } from "@/components/interview-deck";

export const metadata: Metadata = {
  title: `Interview Deck — ${config.siteTitle}`,
  description: "Interactive personal introduction deck by Cheng-Ting Chen.",
};

const slides = [
  "CT Chen",
  "About Me",
  "Experience",
  "Cacdi Projects: Manual Create",
  "Cacdi Projects: Webhook",
  "Cacdi Projects: Google Form Automation",
  "Cacdi Projects: Result",
  "Cacdi Projects: Stable CMS",
  "Cacdi Projects: Tools",
  "Projects Overview",
  "FurFriend-Finder",
  "FurFriend-Finder: Reason One",
  "FurFriend-Finder: Reason Two",
  "FurFriend-Finder: Reason Three",
  "Data Collection",
  "Data Collection Flow",
  "FurFriend Finder System",
  "Matching Mechanism",
  "Easy to Use",
  "Result",
  "Limitation and Further Work",
  "TripEase",
  "TripEase Result",
  "Tools",
].map((title, index) => {
  const slideNumber = String(index + 1).padStart(2, "0");

  return {
    id: slideNumber,
    title,
    src: `/interview-deck/slides/slide-${slideNumber}.jpg`,
  };
});

export default function InterviewDeckPage() {
  return (
    <InterviewDeck
      downloadHref="/interview-deck/downloads/personal-deck.pdf"
      slides={slides}
    />
  );
}
