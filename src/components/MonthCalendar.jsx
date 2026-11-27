import { useMemo, useState } from "react";

// Full and short English month names, in calendar order. Matching is
// case-sensitive on the capital letter (so a sentence "… may be …" is not read
// as May) and word-bounded, so only real month words match.
const MONTHS = [
  ["January", "Jan"], ["February", "Feb"], ["March", "Mar"], ["April", "Apr"],
  ["May"], ["June", "Jun"], ["July", "Jul"], ["August", "Aug"],
  ["September", "Sept", "Sep"], ["October", "Oct"], ["November", "Nov"], ["December", "Dec"],
].map((names, index) => ({ names, index }));

const MONTH_RE = new RegExp(
  `\\b(${MONTHS.flatMap((m) => m.names).join("|")})\\b`,
  "g"
);

/** Month index (0–11) for a single month word, or -1. */
function monthIndex(word) {
  const hit = MONTHS.find((m) => m.names.includes(word));
  return hit ? hit.index : -1;
}

/**
 * The months named in a best-time entry, in calendar order and de-duplicated.
 *
 * Handles: several separate months ("June and July"), ranges joined by a
 * hyphen / en dash / em dash / "to" ("April–June" expands to April, May, June),
 * and ranges that wrap past December ("November–February").
 *
 * If the entry carries a dedicated `months` field (an array or string), that is
 * used first. Returns [] when no real month word is found, so the caller shows
 * the text alone with no calendar.
 */
export function monthsFromEntry(entry) {
  // a dedicated months field wins when present
  const dedicated = entry && typeof entry === "object" ? entry.months : null;
  if (dedicated != null) {
    const words = Array.isArray(dedicated) ? dedicated : String(dedicated).split(/[,/&]+|\band\b|\bto\b|[-–—]/);
    const set = new Set();
    for (const w of words) {
      const idx = monthIndex(String(w).trim());
      if (idx >= 0) set.add(idx);
    }
    if (set.size) return [...set].sort((a, b) => a - b);
  }

  const text = entry && typeof entry === "object" ? entry.text ?? "" : String(entry ?? "");
  const matches = [...String(text).matchAll(MONTH_RE)];
  if (!matches.length) return [];

  const out = new Set();
  for (let k = 0; k < matches.length; k += 1) {
    const start = monthIndex(matches[k][1]);
    if (start < 0) continue;
    const next = matches[k + 1];
    // is the gap between this month and the next exactly a range connector?
    if (next) {
      const between = text.slice(matches[k].index + matches[k][0].length, next.index);
      if (/^\s*(?:[-–—]|\bto\b)\s*$/i.test(between)) {
        const end = monthIndex(next[1]);
        if (end >= 0) {
          let i = start;
          out.add(i);
          while (i !== end) {
            i = (i + 1) % 12;
            out.add(i);
          }
          k += 1; // consumed the range end
          continue;
        }
      }
    }
    out.add(start);
  }
  return [...out].sort((a, b) => a - b);
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_LABELS = MONTHS.map((m) => m.names[0]);
const CALENDAR_YEAR = new Date().getFullYear();

/**
 * A compact month calendar (week starts Monday). Plain Date API, no dependency.
 * Several months are shown as pill tabs that switch the grid; the tab resets to
 * the first month when `key` changes (e.g. a new destination/entry).
 */
function MonthCalendar({ months, label, resetKey }) {
  const [active, setActive] = useState(0);
  // reset the tab when the calendar's subject changes (a different entry)
  const [seenKey, setSeenKey] = useState(resetKey);
  if (resetKey !== seenKey) {
    setSeenKey(resetKey);
    setActive(0);
  }
  const month = months[Math.min(active, months.length - 1)];
  // the calendar year is fixed for the life of the page
  const year = CALENDAR_YEAR;

  const grid = useMemo(() => {
    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // getDay(): 0 = Sunday. Monday-first offset.
    const lead = (first.getDay() + 6) % 7;
    const cells = [];
    for (let i = 0; i < lead; i += 1) cells.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);
    return cells;
  }, [month, year]);

  return (
    <div role="group" aria-label={`${label} ${MONTH_LABELS[month]} ${year}`} className="mt-2 w-full max-w-[260px]">
      {months.length > 1 ? (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {months.map((m, i) => (
            <button
              key={m}
              type="button"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              className={`rounded-md px-2 py-1 text-[12px] transition-colors ${
                i === active ? "bg-primary text-mist" : "bg-mist text-smoke hover:bg-e4"
              }`}
            >
              {MONTH_LABELS[m]}
            </button>
          ))}
        </div>
      ) : null}

      <div className="rounded-lg bg-mist p-3">
        <p className="mb-2 text-center font-display text-[14px] font-medium text-ink">
          {MONTH_LABELS[month]} {year}
        </p>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-smoke">
          {WEEKDAYS.map((w) => (
            <span key={w} className="font-medium">
              {w}
            </span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1 text-center text-[12px] text-ink">
          {grid.map((d, i) => (
            <span key={i} className="flex h-6 items-center justify-center">
              {d ?? ""}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * A best-time entry: its text plus, when it names any month, a month calendar.
 * `resetKey` (e.g. the destination slug) resets the tab to the first month.
 */
export function BestTimeItem({ entry, resetKey }) {
  const months = useMemo(() => monthsFromEntry(entry), [entry]);
  const text = typeof entry === "string" ? entry : entry?.text ?? "";
  return (
    <>
      <span className="t-body">{text}</span>
      {months.length ? <MonthCalendar months={months} label="Calendar for" resetKey={resetKey} /> : null}
    </>
  );
}
