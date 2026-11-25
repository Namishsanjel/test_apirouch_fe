import { useMemo } from "react";
import { DESTINATIONS_SECTION } from "../data/content.js";
import { SectionHead, HeadCopy, Eyebrow } from "./ui.jsx";
import { Reveal } from "../anim.jsx";
import { stagger } from "../motion.js";
import { useStrapiDestinationsState, STRAPI_STATUS } from "../lib/strapiData.jsx";
import { destinationList } from "../lib/catalog.js";
import { SectionErrorInline, SectionEmptyInline } from "./SectionError.jsx";

/** The home page shows the first four destinations (in `order`). */
const HOME_COUNT = 4;

/** The first paragraph of a flattened blocks body, for the one-line teaser. */
function firstParagraph(text) {
  return String(text ?? "").split(/\n+/).find((line) => line.trim())?.trim() ?? "";
}

/** Alternating rows: photo on one side, region + heading + copy on the other. */
export default function Destinations() {
  const { data, status, retry } = useStrapiDestinationsState();
  const destinations = useMemo(
    () =>
      [...destinationList(data)]
        .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER))
        .slice(0, HOME_COUNT),
    [data],
  );

  return (
    <section id="destinations" className="section-py">
      <div className="container-x">
        <SectionHead badge={DESTINATIONS_SECTION.badge} title={DESTINATIONS_SECTION.title}>
          <HeadCopy>{DESTINATIONS_SECTION.body}</HeadCopy>
          <a href="/destinations" className="t-link text-ink underline underline-offset-4">
            All destinations
          </a>
        </SectionHead>

        {status === STRAPI_STATUS.ERROR ? (
          <div className="mt-8 min-[639.98px]:mt-12">
            <SectionErrorInline onRetry={retry} />
          </div>
        ) : status === STRAPI_STATUS.EMPTY ? (
          <div className="mt-8 min-[639.98px]:mt-12">
            <SectionEmptyInline />
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-8 min-[639.98px]:mt-12 min-[639.98px]:gap-12">
            {destinations.map((d, i) => (
              <Reveal
                key={d.slug}
                delay={stagger(i, 120)}
                className={`flex flex-col items-start gap-6 min-[900px]:flex-row min-[900px]:items-center min-[900px]:gap-16 ${
                  i % 2 === 1 ? "min-[900px]:flex-row-reverse" : ""
                }`}
              >
                {d.image ? (
                  <img
                    src={d.image}
                    alt={d.alt}
                    loading="lazy"
                    className="h-[240px] w-full shrink-0 rounded-lg object-cover min-[639.98px]:h-[320px] min-[900px]:h-[420px] min-[900px]:w-[645px]"
                  />
                ) : null}
                <div className="w-full min-w-0 flex-1">
                  <Eyebrow>{d.region}</Eyebrow>
                  <h3 className="t-h3l mt-3">
                    <a href={`/destinations/${d.slug}`}>{d.name}</a>
                  </h3>
                  <p className="t-body mt-3 max-w-[470px]">{firstParagraph(d.body)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
