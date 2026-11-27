import Icon from "../data/Icon.jsx";
import { serviceIconFor } from "../assets/service-icons.jsx";

// icon ids from the site's own set, one per known service; default below
const SERVICE_ICON = {
  Guiding: "2784223275",
  Equipment: "1118047839",
  Meals: "50407791",
  "Small groups": "2109778876",
  Transportation: "535953797",
  Permits: "1118047839",
  "Travel insurance": "2109778876",
};
const DEFAULT_ICON = "2327548604";

/**
 * Asymmetric bento on a 4-unit desktop grid. A normal card is 1 unit, a wide
 * card exactly 2 units (2x1) — never 3 or 4, except a lone single-service page.
 * Every row is a completely full 4 units (no gaps). The layouts by count:
 *
 *   1 -> [4]                     (only full-width exception)
 *   2 -> 2 2
 *   3 -> 1 1 2
 *   4 -> 2 2 / 2 2
 *   5 -> 1 1 2 / 2 2
 *   6 -> 1 1 2 / 2 1 1
 *   7 -> 1 1 2 / 2 2 / 2 2
 *   8 -> 1 1 2 / 2 1 1 / 2 2
 *
 * Above 8, the 6-item block [1,1,2,2,1,1] repeats (each pair fills two full
 * rows), then the remainder (count % 6) is laid out with the small-count table
 * below — each of which also fills whole rows — so no gap and no tile > 2 wide.
 * Below ~900px the grid is a single column, so the spans only apply on desktop.
 */
const SMALL = {
  1: [4],
  2: [2, 2],
  3: [1, 1, 2],
  4: [2, 2, 2, 2],
  5: [1, 1, 2, 2, 2],
  6: [1, 1, 2, 2, 1, 1],
  7: [1, 1, 2, 2, 2, 2, 2],
  8: [1, 1, 2, 2, 1, 1, 2, 2],
};
const BLOCK6 = [1, 1, 2, 2, 1, 1];
// remainder (1..5) layouts used after repeated 6-blocks; each fills whole rows
const REM = { 1: [4], 2: [2, 2], 3: [1, 1, 2], 4: [2, 2, 2, 2], 5: [1, 1, 2, 2, 2] };

/** Column span (of 4) for each card, by count then position. */
export function spansFor(count) {
  if (count <= 0) return [];
  if (SMALL[count]) return [...SMALL[count]];
  const out = [];
  const full = Math.floor(count / 6);
  for (let i = 0; i < full; i += 1) out.push(...BLOCK6);
  const rem = count % 6;
  if (rem) out.push(...REM[rem]);
  return out;
}

/** The span of the card at index `i` for a list of `count` cards. */
export const spanFor = (i, count) => {
  const list = spansFor(count);
  return list[i] ?? 1;
};

export const SPAN_CLASS = {
  1: "min-[900px]:col-span-1",
  2: "min-[900px]:col-span-2",
  4: "min-[900px]:col-span-4",
};

/** Size label from a span: a 2-wide card is "wide" (2x1); 1 is "narrow". */
export const sizeFor = (span) => (span === 1 ? "narrow" : "wide");

/** The arrow pair that rolls out/in on hover and focus. */
export function LearnArrow() {
  return (
    <span className="learn-arrow" aria-hidden="true">
      <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
        <path d="M3 10h13M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
        <path d="M3 10h13M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/**
 * One service as a bento tile — icon top-left, title and description, and a
 * "Learn more" row pinned to the bottom. `size` is "wide" (3 of 4 columns) or
 * "narrow" (1 of 4); narrow cards get a slightly smaller title and wrap
 * cleanly, since a long title (e.g. "International & Domestic Flight
 * Ticketing") has only a quarter of the row to fit in.
 *
 * `onNavigate` is optional: the Services page leaves it out; the nav dropdown
 * passes it so clicking a card also closes the menu, as before.
 */
export function ServiceTile({ service, size = "wide", className = "", onNavigate }) {
  const title = service.title;
  const narrow = size === "narrow";
  // the service's own SVG when one matches; the existing shield icon otherwise
  const ServiceIcon = serviceIconFor(title, service.slug);

  return (
    <a
      href={`/services/${service.slug}`}
      aria-label={`Learn more about ${title}`}
      onClick={onNavigate}
      className={`service-tile group flex flex-col rounded-lg bg-mist p-5 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(40,40,40,0.12)] min-h-[200px] ${className}`}
    >
      {ServiceIcon ? (
        <span
          className="icon-svg text-ink"
          style={{ display: "block", width: 36, height: 36, maxWidth: "100%", flex: "none" }}
        >
          <ServiceIcon size={36} />
        </span>
      ) : (
        <Icon id={SERVICE_ICON[title] ?? DEFAULT_ICON} size={36} />
      )}
      <div className="mt-auto flex flex-col pt-6">
        <p className={`t-h4 break-words ${narrow ? "text-[clamp(15px,1.4vw,18px)]" : ""}`}>{title}</p>
        {service.shortDescription ? <p className="t-body mt-1">{service.shortDescription}</p> : null}
        <span className="mt-6 flex items-center justify-between">
          <span className="t-link text-ink">Learn more</span>
          <LearnArrow />
        </span>
      </div>
    </a>
  );
}
