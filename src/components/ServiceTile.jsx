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
 * Asymmetric bento on a 3-column desktop grid. A normal card is 1 column, a
 * wide card 2 columns (2x1). Rows alternate W N then N W; a lone leftover card
 * at the end spans all 3 columns. Every row is completely full (no gaps):
 *
 *   1 -> [3]
 *   2 -> [2,1]
 *   3 -> [2,1,3]
 *   4 -> W N / N W          (2,1,1,2)
 *   5 -> W N / N W / [3]    (2,1,1,2,3)
 *   6 -> W N / N W / W N    (2,1,1,2,2,1)
 *
 * Above 4, the 4-item block [2,1,1,2] repeats (two full rows), then the
 * remainder (count % 4) uses REM below — each also fills whole rows.
 * Tablet keeps 2 columns and mobile 1 column, so the spans only apply at the
 * desktop breakpoint (min-[900px]).
 */
// One repeating block lays out two full 3-column rows: W N (2+1), then N W (1+2).
const BLOCK = [2, 1, 1, 2];
// left-over rows after whole blocks; each still fills 3 columns (2+1, or a lone
// card spanning the whole row).
const REM = { 1: [3], 2: [2, 1], 3: [2, 1, 3] };

/**
 * Column span (of 3) for each card, by count then position. Rows alternate
 * W N then N W; a card left over on its own at the end spans all 3 columns.
 *
 *   1 -> [3]          2 -> [2,1]        3 -> [2,1,3]
 *   4 -> [2,1,1,2]    5 -> [2,1,1,2,3]  6 -> [2,1,1,2,2,1]
 */
export function spansFor(count) {
  if (count <= 0) return [];
  const out = [];
  const full = Math.floor(count / BLOCK.length);
  for (let i = 0; i < full; i += 1) out.push(...BLOCK);
  const rem = count % BLOCK.length;
  if (rem) out.push(...REM[rem]);
  return out;
}

/** The span of the card at index `i` for a list of `count` cards. */
export const spanFor = (i, count) => {
  const list = spansFor(count);
  return list[i] ?? 1;
};

// desktop = 3-column grid (see ServicesPage / the nav dropdown)
export const SPAN_CLASS = {
  1: "min-[900px]:col-span-1",
  2: "min-[900px]:col-span-2",
  3: "min-[900px]:col-span-3",
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
