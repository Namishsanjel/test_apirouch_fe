import { useEffect } from "react";
import PageShell from "../components/PageShell.jsx";
import { PageHeader } from "../components/ui.jsx";
import { PAGES } from "../data/content.js";
import { SERVICES_PAGE } from "../data/newPages.js";
import { useStrapiList, STRAPI_STATUS } from "../lib/strapiData.jsx";
import { ServicesGridSkeleton } from "../components/skeletons.jsx";
import { SectionError, SectionEmpty } from "../components/SectionError.jsx";
import { ServiceTile, spanFor, sizeFor, SPAN_CLASS } from "../components/ServiceTile.jsx";

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
              const span = spanFor(i, items.length);
              return (
                <ServiceTile
                  key={s.documentId ?? s.id ?? s.slug}
                  service={s}
                  size={sizeFor(span)}
                  className={SPAN_CLASS[span]}
                />
              );
            })}
          </div>
        )}
      </section>
    </PageShell>
  );
}
