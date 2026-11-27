// Inline React icons for the Services page cards.
//
// The four SVGs from the design folder (project root "service icons/") are
// reproduced here as inline components so their colour follows the text
// (fill="currentColor"), matching the shield icon they replace. The originals
// had a hardcoded fill="#e3e3e3"; only the project copies use currentColor.
// No new dependency is needed — the project has no SVG-import (svgr) setup.

function base(size) {
  return { viewBox: "0 0 24 24", width: size, height: size, "aria-hidden": true, focusable: "false" };
}

export function TourPackageIcon({ size = 36 }) {
  return (
    <svg {...base(size)} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M11,19.43V12.58L5,9.1v6.85l6,3.48Zm2,0l6-3.48V9.1l-6,3.47v6.85Zm-2,2.3L4,17.7q-0.47-0.27-0.74-0.72Q3,16.52 3,15.98V8.02q0-0.55 0.26-1T4,6.3l7-4.03Q11.48,2 12,2q0.53,0 1,0.27L20,6.3q0.48,0.27 0.74,0.72t0.26,1v7.95q0,0.55-0.26,1T20,17.7l-7,4.03Q12.53,22 12,22t-1-0.27Zm5-13.2l1.93-1.1L12,4L10.05,5.13L16,8.52Zm-4,2.33l1.95-1.13L8.03,6.3L6.08,7.43L12,10.85Z" />
    </svg>
  );
}

export function FlightTicketingIcon({ size = 36 }) {
  return (
    <svg {...base(size)} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M3,21V19H21v2H3Zm1.75-5L1,9.75L3.4,9.1l2.8,2.35l3.5-0.93L4.53,3.63l2.9-0.78L14.9,9.13l4.25-1.15q0.8-0.22 1.51,0.19T21.6,9.38q0.23,0.8-0.19,1.51T20.2,11.83L4.75,16Z" />
    </svg>
  );
}

export function VisaAssistanceIcon({ size = 36 }) {
  return (
    <svg {...base(size)} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.5,18.5h7V17h-7v1.5Zm3.5-3q2.08,0 3.54-1.46T17,10.5q0-2.08-1.46-3.54T12,5.5q-2.07,0-3.54,1.46T7,10.5t1.46,3.54T12,15.5Zm0-1.68q-0.2-0.28-0.42-0.91q-0.22-0.64-0.3-1.66h1.45q-0.08,1.02-0.3,1.66T12,13.83ZM10.2,13.5q-0.6-0.38-1.03-0.95q-0.43-0.57-0.58-1.3H9.78q0.05,0.63 0.15,1.19T10.2,13.5Zm3.6,0q0.18-0.5 0.28-1.06t0.15-1.19H15.4q-0.15,0.72-0.57,1.3Q14.4,13.13 13.8,13.5ZM8.6,9.75q0.15-0.73 0.58-1.3T10.2,7.5Q10.03,8 9.93,8.56T9.78,9.75H8.6Zm2.68,0q0.08-1.03 0.3-1.66T12,7.18q0.2,0.27 0.43,0.91q0.22,0.64 0.3,1.66H11.28Zm2.95,0q-0.05-0.63-0.15-1.19T13.8,7.5q0.6,0.38 1.03,0.95t0.57,1.3H14.23ZM4,22V2H18q0.82,0 1.41,0.59T20,4V20q0,0.82-0.59,1.41T18,22H4Zm2-2H18V4H6V20Zm0,0V4V20Z" />
    </svg>
  );
}

export function HotelBookingIcon({ size = 36 }) {
  return (
    <svg {...base(size)} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M1,19V4H3V14h8V6h8q1.65,0 2.83,1.18T23,10v9H21V16H3v3H1Zm3.88-6.88Q4,11.25 4,10T4.88,7.88T7,7T9.13,7.88T10,10T9.13,12.13T7,13T4.88,12.13ZM13,14h8V10q0-0.83-0.59-1.41T19,8H13v6ZM7.71,10.71Q8,10.43 8,10Q8,9.57 7.71,9.29T7,9Q6.58,9 6.29,9.29T6,10t0.29,0.71T7,11t0.71-0.29ZM7,10Zm6-2v6V8Z" />
    </svg>
  );
}

/** Normalise a title/slug for matching: lowercase, alphanumerics only. */
function key(value) {
  return String(value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * The SVG component for a service, matched on its title or slug.
 *
 * Matching ignores case, spaces, hyphens, underscores and punctuation. The
 * flight/ticketing entry is also matched on the partial words "flight" and
 * "ticketing". Returns null when nothing matches, so the caller can fall back
 * to the existing shield icon — no guessing, no empty gap.
 */
export function serviceIconFor(title, slug) {
  const t = key(title);
  const s = key(slug);

  if (t.includes("tourpackage") || s.includes("tourpackage")) return TourPackageIcon;
  if (
    t.includes("flight") ||
    t.includes("ticketing") ||
    s.includes("flight") ||
    s.includes("ticketing")
  ) {
    return FlightTicketingIcon;
  }
  if (t.includes("visa") || s.includes("visa")) return VisaAssistanceIcon;
  if (t.includes("hotelbooking") || s.includes("hotelbooking") || t.includes("hotel")) {
    return HotelBookingIcon;
  }
  return null;
}
