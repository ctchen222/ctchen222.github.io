"use client";

import { useEffect, useRef, useState, useTransition } from "react";

type Slide = {
  id: string;
  title: string;
  src: string;
};

type InterviewDeckProps = {
  downloadHref: string;
  slides: Slide[];
};

function clampSlideIndex(value: number, total: number) {
  return Math.min(Math.max(value, 0), total - 1);
}

function getIndexFromHash(total: number) {
  if (typeof window === "undefined") return 0;

  const raw = window.location.hash.replace("#", "");
  const slideNumber = Number(raw);

  if (!Number.isFinite(slideNumber)) return 0;
  return clampSlideIndex(slideNumber - 1, total);
}

export function InterviewDeck({ downloadHref, slides }: InterviewDeckProps) {
  const [index, setIndex] = useState(0);
  const [isFilmstripOpen, setIsFilmstripOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const shellRef = useRef<HTMLDivElement>(null);
  const current = slides[index];

  function goTo(nextIndex: number) {
    const safeIndex = clampSlideIndex(nextIndex, slides.length);

    startTransition(() => {
      setIndex(safeIndex);
      setIsFilmstripOpen(false);
    });

    window.history.replaceState(null, "", `#${safeIndex + 1}`);
  }

  function next() {
    goTo(index + 1);
  }

  function previous() {
    goTo(index - 1);
  }

  function toggleFullscreen() {
    const target = shellRef.current;

    if (!target) return;

    if (!document.fullscreenElement) {
      target.requestFullscreen?.();
      return;
    }

    document.exitFullscreen?.();
  }

  useEffect(() => {
    setIndex(getIndexFromHash(slides.length));

    function handleHashChange() {
      setIndex(getIndexFromHash(slides.length));
    }

    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    window.addEventListener("hashchange", handleHashChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [slides.length]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented) return;

      if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        next();
      }

      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        previous();
      }

      if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        goTo(slides.length - 1);
      }

      if (event.key.toLowerCase() === "g") {
        event.preventDefault();
        setIsFilmstripOpen((open) => !open);
      }

      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        toggleFullscreen();
      }

      if (event.key === "Escape") {
        setIsFilmstripOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div className="interview-deck-page">
      <section
        className="interview-deck-shell"
        data-pending={isPending ? "true" : "false"}
        ref={shellRef}
      >
        <header className="deck-topbar">
          <div>
            <p className="deck-eyebrow">Personal introduction deck</p>
            <h1>Cheng-Ting Chen</h1>
          </div>
          <div className="deck-actions" aria-label="Deck actions">
            <a
              className="deck-action-link"
              href={downloadHref}
              rel="noopener noreferrer"
              target="_blank"
            >
              Download PDF
            </a>
            <button onClick={() => setIsFilmstripOpen((open) => !open)} type="button">
              {isFilmstripOpen ? "Hide slides" : "Show slides"}
            </button>
            <button onClick={toggleFullscreen} type="button">
              {isFullscreen ? "Exit full screen" : "Full screen"}
            </button>
          </div>
        </header>

        <div className="deck-viewport">
          <button
            aria-label="Previous slide"
            className="deck-side-button deck-side-button-left"
            disabled={index === 0}
            onClick={previous}
            type="button"
          >
            Prev
          </button>

          <div
            aria-label={`Slide ${index + 1} of ${slides.length}: ${current.title}`}
            className="deck-stage"
            onClick={next}
            role="button"
            tabIndex={0}
          >
            <img
              alt={current.title}
              className="deck-slide-image"
              key={current.id}
              src={current.src}
            />
            <div className="deck-slide-caption">
              <span>{current.id}</span>
              <strong>{current.title}</strong>
            </div>
          </div>

          <button
            aria-label="Next slide"
            className="deck-side-button deck-side-button-right"
            disabled={index === slides.length - 1}
            onClick={next}
            type="button"
          >
            Next
          </button>
        </div>

        <footer className="deck-footer">
          <div className="deck-progress" aria-hidden="true">
            <span style={{ width: `${((index + 1) / slides.length) * 100}%` }} />
          </div>
          <p>
            {index + 1} / {slides.length} - Use arrows, space, Home/End, G for slides, F for full screen.
          </p>
        </footer>

        {isFilmstripOpen ? (
          <div className="deck-filmstrip" aria-label="Slide thumbnails">
            {slides.map((slide, slideIndex) => (
              <button
                className="deck-thumbnail"
                data-active={slideIndex === index ? "true" : "false"}
                key={slide.id}
                onClick={() => goTo(slideIndex)}
                type="button"
              >
                <img alt="" src={slide.src} />
                <span>
                  {slide.id}. {slide.title}
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
