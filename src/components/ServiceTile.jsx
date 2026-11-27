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
 * Asymmetric bento on a 4-column grid, shared by the Services page and the
 * Services nav dropdown. Row 1 is a wide card (3 cols) beside a narrow one
 * (1 col); row 2 is the mirror — narrow then wide:
 *
 *   [ wide (3) | narrow (1) ]
 *   [ narrow (1) | wide (3) ]
 *
 * The size is chosen by a card's position in this list, not by its title, so
 * the order and content stay whatever the backend returns. Below ~900px every
 * card collapses to a single full-width column.
 */
export const SIZES = ["wide", "narrow", "narrow", "wide"];

export const spanFor = (i) => (SIZES[i] === "wide" ? "wide" : "narrow");

export const SPAN_CLASS = {
  wide: "min-[900px]:col-span-3",
  narrow: "min-[900px]:col-span-1",
};

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
