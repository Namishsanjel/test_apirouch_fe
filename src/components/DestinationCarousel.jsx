import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../motion.js";

const SLIDE_MS = 500; // matches the requested ~500ms ease-in-out
const AUTOPLAY_MS = 5000;

function Arrow({ dir }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d={dir === "left" ? "M8.75 3.5 5.25 7l3.5 3.5" : "M5.25 3.5 8.75 7l-3.5 3.5"}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Destination image carousel.
 *
 * The frame matches the static hero it replaces (same height, radius, position
 * in the page). Movement is a two-frame CSS translateX: Next pairs
 * [current, next] and slides the track from 0 to -50% (current exits left, next
 * enters from the right); Prev pairs [prev, current] and slides from -50% to 0.
 * Both wrap by index, so the ends loop seamlessly. With a single image no
 * controls, dots or autoplay are shown — it is just the frame.
 *
 * Autoplay runs every 5s; it pauses on hover and on keyboard focus within the
 * carousel, when the tab is hidden, and waits while a slide is animating; any
 * manual control restarts it. A real timer is cleared on unmount. Reduced
 * motion disables autoplay and the slide (index jumps instead).
 */
export default function DestinationCarousel({ images, name, className = "" }) {
  const count = images.length;
  const [state, setState] = useState({ index: 0, dir: 0, active: false });
  const { index, dir, active } = state;
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(
    () => typeof document !== "undefined" && document.hidden
  );
  const touchX = useRef(null);
  const regionRef = useRef(null);

  const go = useCallback(
    (step) => {
      if (count < 2) return;
      setState((s) => {
        if (s.dir !== 0) return s; // ignore clicks while a slide is animating
        if (prefersReducedMotion()) {
          return { index: (s.index + step + count) % count, dir: 0, active: false };
        }
        return { ...s, dir: step, active: false };
      });
    },
    [count]
  );

  // Flip to the end offset on the next frame so the browser animates from the
  // start offset it has already painted.
  useEffect(() => {
    if (dir === 0 || active) return undefined;
    const raf = requestAnimationFrame(() => setState((s) => (s.dir ? { ...s, active: true } : s)));
    return () => cancelAnimationFrame(raf);
  }, [dir, active]);

  const finish = useCallback(() => {
    setState((s) => (s.dir === 0 ? s : { index: (s.index + s.dir + count) % count, dir: 0, active: false }));
  }, [count]);

  // Dots jump straight to a slide (no multi-step animation), ignored mid-slide.
  const goto = useCallback(
    (target) => {
      setState((s) =>
        count < 2 || s.dir !== 0 || target === s.index ? s : { index: target, dir: 0, active: false }
      );
    },
    [count]
  );

  // Track tab visibility so autoplay pauses while hidden and restarts on return.
  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Autoplay: paused on hover/focus, tab hidden, while animating, or under
  // reduced motion. Re-runs whenever any of those change or a slide commits,
  // so each committed slide and every manual control restarts the 5s timer.
  useEffect(() => {
    if (count < 2 || prefersReducedMotion() || hovered || focused || hidden || dir !== 0) {
      return undefined;
    }
    const t = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [count, index, dir, hovered, focused, hidden, go]);

  // Preload the next frame once the current one is known.
  useEffect(() => {
    if (count < 2) return;
    const img = new Image();
    img.src = images[(index + 1) % count].src;
  }, [index, count, images]);

  if (!count) return null;

  const prevIdx = (index - 1 + count) % count;
  const nextIdx = (index + 1) % count;
  const isNext = dir > 0;
  const left = dir === 0 ? images[index] : isNext ? images[index] : images[prevIdx];
  const right = dir === 0 ? images[nextIdx] : isNext ? images[nextIdx] : images[index];
  const startOffset = dir === 0 ? 0 : isNext ? 0 : -50;
  const endOffset = dir === 0 ? 0 : isNext ? -50 : 0;
  const offset = active ? endOffset : startOffset;

  const alt = (i) => `${name} — image ${i + 1} of ${count}`;

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  };

  return (
    <div
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${name} photos`}
      className={`relative h-[240px] overflow-hidden rounded-lg bg-mist min-[639.98px]:h-[320px] min-[1100px]:h-[420px] ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
      onKeyDown={onKeyDown}
      onTouchStart={(e) => {
        touchX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      }}
    >
      <div
        className="flex h-full w-[200%] will-change-transform"
        style={{
          transform: `translateX(${offset}%)`,
          transition: active ? `transform ${SLIDE_MS}ms ease-in-out` : "none",
        }}
        onTransitionEnd={finish}
      >
        <img
          src={left?.src}
          alt={dir === 0 ? alt(index) : isNext ? alt(index) : alt(prevIdx)}
          className="h-full w-1/2 shrink-0 object-cover"
          loading="eager"
        />
        <img
          src={right?.src}
          alt={dir === 0 ? alt(nextIdx) : isNext ? alt(nextIdx) : alt(index)}
          className="h-full w-1/2 shrink-0 object-cover"
          loading="lazy"
        />
      </div>

      {count > 1 ? (
        <>
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => go(-1)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-mist text-ink hover:bg-cream"
            >
              <Arrow dir="left" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => go(1)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-mist text-ink hover:bg-cream"
            >
              <Arrow dir="right" />
            </button>
          </div>

          <div className="absolute bottom-5 left-3 z-10 flex items-center gap-2">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => goto(i)}
                className={`h-2 w-2 cursor-pointer rounded-full transition-colors ${
                  i === index ? "bg-mist" : "bg-mist/50 hover:bg-mist"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
