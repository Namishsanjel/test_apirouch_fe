import { useEffect } from "react";
import PageShell from "../components/PageShell.jsx";
import { PageHeader } from "../components/ui.jsx";
import Icon from "../data/Icon.jsx";
import { PAGES } from "../data/content.js";
import { SERVICES_PAGE } from "../data/newPages.js";
import { useStrapiList, STRAPI_STATUS } from "../lib/strapiData.jsx";
import { ServicesGridSkeleton } from "../components/skeletons.jsx";
import { SectionError, SectionEmpty } from "../components/SectionError.jsx";
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
 * Asymmetric bento on a 4-column grid. Row 1 is a wide card (3 cols) beside a
 * narrow one (1 col); row 2 is the mirror — narrow then wide:
 *
 *   [ wide (3) | narrow (1) ]
 *   [ narrow (1) | wide (3) ]
 *
 * The size is chosen by a card's position in this list, not by its title, so
 * the order and content stay whatever the backend returns. Below ~900px every
 * card collapses to a single full-width column.
 */
const SIZES = ["wide", "narrow", "narrow", "wide"];

const spanFor = (i) => (SIZES[i] === "wide" ? "wide" : "narrow");

const SPAN_CLASS = {
  wide: "min-[900px]:col-span-3",
  narrow: "min-[900px]:col-span-1",
};

/** The arrow pair that rolls out/in on hover and focus. */
function LearnArrow() {
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
 * One service as a bento tile. Every tile is the same card — icon top-left,
 * title and description, and a "Learn more" row pinned to the bottom. `size`
 * is "wide" (3 of 4 columns) or "narrow" (1 of 4); narrow cards get a slightly
 * smaller title and wrap cleanly, since a long title (e.g. "International &
 * Domestic Flight Ticketing") has only a quarter of the row to fit in.
 */
function ServiceTile({ service, size = "wide", className = "" }) {
  const title = service.title;
  const narrow = size === "narrow";
  // the service's own SVG when one matches; the existing shield icon otherwise
  const ServiceIcon = serviceIconFor(title, service.slug);

  return (
    <a
      href={`/services/${service.slug}`}
      aria-label={`Learn more about ${title}`}
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

export default function ServicesPage() {
  const page = PAGES["/services"];
  const { items, status, retry } = useStrapiList("services?populate=image&sort=order:asc");
  const ready = status === STRAPI_STATUS.READY && Array.isArray(items) && items.length > 0;

  useEffect(() => {
    document.title = page.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", page.description);
  }, [page]);

  return (
    <PageShell>
      <section className="page-sec container-x flex flex-col gap-8 min-[639.98px]:gap-12">
        <PageHeader badge={SERVICES_PAGE.badge} title={SERVICES_PAGE.title} sub={SERVICES_PAGE.sub} />

        {/* While the request is in flight the bento is a skeleton at the same
            slots. Strapi's services when it has any, in backend order. An error
            state with its own retry when the request failed. One neutral line
            when the collection is empty. No photo tiles and no service.image on
            this page — every tile is a service card. */}
        {status === STRAPI_STATUS.LOADING ? (
          <ServicesGridSkeleton />
        ) : status === STRAPI_STATUS.ERROR ? (
          <SectionError onRetry={retry} />
        ) : !ready ? (
          <SectionEmpty />
        ) : (
          <div className="grid grid-cols-1 gap-4 min-[900px]:grid-cols-4">
            {items.map((s, i) => {
              const size = spanFor(i);
              return (
                <ServiceTile
                  key={s.documentId ?? s.id ?? s.slug}
                  service={s}
                  size={size}
                  className={SPAN_CLASS[size]}
                />
              );
            })}
          </div>
        )}
      </section>
    </PageShell>
  );
}
