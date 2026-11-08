import { useId, useState } from "react";

/**
 * An independent-row accordion, styled to match the FAQ list: a mist panel per
 * item, a rounded-lg card, and the same grid-rows slide with a plus/close cross
 * fade. Unlike the FAQ column (one answer at a time), each row here opens and
 * closes on its own, which is what the tour schedule wants.
 *
 * Each row's header is a real <button> with aria-expanded and aria-controls, so
 * Enter and Space toggle it and the collapsed/expanded state is announced. The
 * panel stays mounted at zero height so the slide works in both directions.
 */
function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h16M12 4v16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.34 6.34 17.66 17.66M17.66 6.34 6.34 17.66" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function Accordion({ items, className = "", style }) {
  const baseId = useId();
  const [open, setOpen] = useState(() => new Set());

  const toggle = (key) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div className={`flex flex-col gap-3 ${className}`} style={style}>
      {items.map((item) => {
        const isOpen = open.has(item.key);
        const headerId = `${baseId}-header-${item.key}`;
        const panelId = `${baseId}-panel-${item.key}`;
        return (
          <div key={item.key} className="rounded-lg bg-mist">
            <h3 className="m-0">
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.key)}
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="t-eyebrow text-smoke">{item.label}</span>
                  {item.title ? <span className="t-h6 text-ink">{item.title}</span> : null}
                </span>
                <span className="relative block h-6 w-6 shrink-0 text-ink">
                  <span
                    className={`absolute inset-0 transition-opacity duration-200 ${isOpen ? "opacity-0" : "opacity-100"}`}
                  >
                    <PlusIcon />
                  </span>
                  <span
                    className={`absolute inset-0 transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"}`}
                  >
                    <CloseIcon />
                  </span>
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div
                  className={`flex flex-col gap-2 px-4 pb-4 transition-opacity duration-200 ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {Array.isArray(item.points) && item.points.length ? (
                    <ul className="flex flex-col gap-2">
                      {item.points.map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-primary" />
                          <span className="t-body">{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : item.body ? (
                    <p className="t-body">{item.body}</p>
                  ) : null}
                  {item.altitudeText || item.durationText ? (
                    <div className="flex flex-wrap gap-x-5 gap-y-1">
                      {item.altitudeText ? (
                        <p className="t-eyebrow text-ink">
                          <span className="text-smoke">Altitude:</span> {item.altitudeText}
                        </p>
                      ) : null}
                      {item.durationText ? (
                        <p className="t-eyebrow text-ink">
                          <span className="text-smoke">Duration:</span> {item.durationText}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
