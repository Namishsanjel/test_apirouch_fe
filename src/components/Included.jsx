import { INCLUDED_SECTION, INCLUDED_PHOTOS } from "../data/content.js";
import { SectionHead, HeadCopy } from "./ui.jsx";
import Icon from "../data/Icon.jsx";
import { useStrapiList, STRAPI_STATUS } from "../lib/strapiData.jsx";
import { FeatureCardSkeleton } from "./skeletons.jsx";

/**
 * The four "What makes the experience different" text tiles come from the
 * CMS services collection, the same endpoint and caching the Services page
 * reads (`useStrapiList` shares one request per path). Titles and short
 * descriptions are the service's own fields; services carry no icon field, so
 * each card falls back to a line icon from the site's own set, chosen by
 * title, with a neutral default for anything new.
 */
const SERVICES_PATH = "services?populate=image&sort=order:asc";

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

/** Mist card: icon, heading, one-line description (measured 625/305 x 180). */
function FeatureCard({ item, className = "" }) {
  return (
    <div className={`flex min-h-[180px] flex-col rounded-lg bg-mist p-4 ${className}`}>
      <Icon id={SERVICE_ICON[item.title] ?? DEFAULT_ICON} size={36} />
      <p className="t-h4 mt-8">{item.title}</p>
      <p className="t-body mt-1">{item.shortDescription}</p>
    </div>
  );
}

/** Photo card: image fills the card, copy sits bottom-left on p-4. */
function PhotoCard({ item, className = "" }) {
  return (
    <div className={`relative h-[180px] overflow-hidden rounded-lg ${className}`}>
      <img src={item.image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <p className="t-h4 text-mist">{item.title}</p>
        <p className="t-body mt-1 text-sage">{item.body}</p>
      </div>
    </div>
  );
}

export default function Included() {
  const { transfers, always } = INCLUDED_PHOTOS;
  const { items, status } = useStrapiList(SERVICES_PATH);

  const loading = status === STRAPI_STATUS.LOADING;
  const failed = status === STRAPI_STATUS.ERROR || status === STRAPI_STATUS.EMPTY;
  // first four services (the request is already sorted on `order`)
  const services = !loading && !failed && Array.isArray(items) ? items.slice(0, 4) : [];

  return (
    <section className="section-py">
      <div className="container-x">
        <SectionHead badge={INCLUDED_SECTION.badge} title={INCLUDED_SECTION.title}>
          <HeadCopy>{INCLUDED_SECTION.body}</HeadCopy>
        </SectionHead>

        <div className="mt-8 grid grid-cols-1 gap-4 min-[639.98px]:mt-12 min-[900px]:grid-cols-2">
          {/* left half */}
          <div className="grid grid-cols-1 gap-4 min-[639.98px]:grid-cols-2">
            {loading ? (
              <>
                <FeatureCardSkeleton />
                <FeatureCardSkeleton />
              </>
            ) : (
              services.slice(0, 2).map((s) => (
                <FeatureCard key={s.documentId ?? s.id ?? s.slug} item={s} />
              ))
            )}
            <PhotoCard item={always} className="min-[639.98px]:col-span-2" />
          </div>
          {/* right half */}
          <div className="grid grid-cols-1 gap-4 min-[639.98px]:grid-cols-2">
            <PhotoCard item={transfers} className="min-[639.98px]:col-span-2" />
            {loading ? (
              <>
                <FeatureCardSkeleton />
                <FeatureCardSkeleton />
              </>
            ) : (
              services.slice(2, 4).map((s) => (
                <FeatureCard key={s.documentId ?? s.id ?? s.slug} item={s} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
