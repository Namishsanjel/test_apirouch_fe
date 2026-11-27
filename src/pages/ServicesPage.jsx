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
 * The bento rhythm, as a flat list of tiles on a 12-column grid. One block is
 * the home "What makes the experience different" geometry — two normal cards
 * top-left, a wide card top-right, a wide card bottom-left, two normal cards
 * bottom-right — expressed here as spans:
 *
 *   [ 3, 3, 6,   ← row 1: normal · normal · wide
 *     6, 3, 3 ]  ← row 2: wide   · normal · normal
 *
 * Tiles repeat that six-wide block down the page. The trailing block is
 * straightened so the last row never leaves an awkward gap.
 */
const BLOCK = [3, 3, 6, 6, 3, 3];

/**
 * The column spans for `count` tiles.
 *
 * Whole blocks of six keep BLOCK's home rhythm untouched. The leftover tiles
 * (count % 6) are laid out on their own so the final row always fills its 12
 * columns — no half-row gap. Every leftover row pattern is a hand-picked set
 * that sums to 12:
 *
 *   1 → [12]              one wide tile, full row
 *   2 → [6, 6]            two half tiles
 *   3 → [4, 4, 4]         three thirds
 *   4 → [6, 6, 6, 6] → two rows: [6,6] then [6,6]
 *   5 → [6, 6] + [4, 4, 4]
 *
 * (4 and 5 are listed for clarity; `TAIL` expands them to whole rows.)
 */
const TAIL = {
  1: [12],
  2: [6, 6],
  3: [4, 4, 4],
  4: [6, 6, 6, 6],
  5: [6, 6, 4, 4, 4],
};

function spans(count) {
  const full = Math.floor(count / 6);
  const out = [];
  for (let b = 0; b < full; b += 1) out.push(...BLOCK);
  const rem = count % 6;
  if (rem) out.push(...TAIL[rem]);
  return out;
}

const SPAN_CLASS = {
  3: "col-span-1 min-[639.98px]:col-span-3",
  4: "col-span-1 min-[639.98px]:col-span-4",
  6: "col-span-1 min-[639.98px]:col-span-6",
  12: "col-span-1 min-[639.98px]:col-span-12",
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
 * One service as a bento tile. Every tile is the same card in the home mist
 * style — icon top-left, title and description, and a "Learn more" row pinned
 * to the bottom. `wide` tiles follow the home photo geometry (shorter, half
 * width) but carry the same colour and content; the min-height is raised a
 * little so the extra "Learn more" row never clips.
 */
function ServiceTile({ service, wide = false, className = "" }) {
  const title = service.title;
  // the service's own SVG when one matches; the existing shield icon otherwise
  const ServiceIcon = serviceIconFor(title, service.slug);

  return (
    <a
      href={`/services/${service.slug}`}
      aria-label={`Learn more about ${title}`}
      className={`service-tile group flex flex-col rounded-lg bg-mist p-5 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(40,40,40,0.12)] ${
        wide ? "min-h-[200px]" : "min-h-[220px]"
      } ${className}`}
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
        <p className="t-h4">{title}</p>
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
          <div className="grid grid-cols-1 gap-4 min-[639.98px]:grid-cols-12">
            {items.map((s, i) => {
              const cols = spans(items.length)[i];
              return (
                <ServiceTile
                  key={s.documentId ?? s.id ?? s.slug}
                  service={s}
                  wide={cols >= 6}
                  className={SPAN_CLASS[cols]}
                />
              );
            })}
          </div>
        )}
      </section>
    </PageShell>
  );
}
