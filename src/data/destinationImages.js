// Local destination gallery images.
//
// The source photos live in the backend repository under
// "final images /destination/<folder>/" ("asia", "europe", "nepal"), compressed
// to JPEG (max 1920px wide, quality 80, sorted by source file name) and copied
// to public/img/destinations/<folder>/NN.jpg. The originals are untouched.
//
// A folder is used ONLY on the destination of the same name. The production
// Strapi destinations (https://apitouch.com/api/destinations) are:
//   Europe -> slug "europe"
//   Nepal  -> slug "Nepal"
//   Asia   -> slug "asia"
// So each folder maps to exactly that destination's slug, keyed lower-cased for
// a case-insensitive match ("Nepal" -> "nepal"). There is no continent, region
// or per-country logic, and no folder is shared with another page. A destination
// with no folder of its own has no local images and falls through to its CMS
// gallery / main image / tour covers.

const count = 5; // images copied per folder

const paths = (folder) =>
  Array.from({ length: count }, (_, i) => `/img/destinations/${folder}/${String(i + 1).padStart(2, "0")}.jpg`);

// lower-cased destination slug -> that destination's own folder images
export const SLUG_IMAGES = {
  asia: paths("asia"),
  europe: paths("europe"),
  nepal: paths("nepal"), // slug "Nepal"
};

/**
 * The local image paths for a destination slug, or [] when that slug has no
 * folder of its own. The slug is compared case-insensitively.
 */
export function localDestinationImages(slug) {
  const key = String(slug ?? "").toLowerCase();
  return key && SLUG_IMAGES[key] ? [...SLUG_IMAGES[key]] : [];
}
