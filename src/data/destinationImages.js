// Local destination gallery images.
//
// The source photos live in the backend repository under
// "final images /destination/<region>/", organised by region ("asia",
// "europe", "nepal"), not by destination slug. They were compressed to JPEG,
// max 1920px wide, quality 80, and copied to
// public/img/destinations/<region>/NN.jpg (max 8 per region, sorted by source
// file name). The originals are untouched.
//
// The live Strapi destination list (verified against /api/destinations) is:
//   bali-indonesia-2 (asia), kyoto-japan-1 (asia), ladakh-india-3 (asia),
//   dolomites-italy-5 (europe), lisbon-portugal-4 (europe),
//   cape-town-south-africa-9 (africa), marrakech-morocco-7 (africa),
//   cusco-peru-11 (south_america).
//
// The folders are named by region, and no destination slug is "asia", "europe"
// or "nepal", so a folder is matched to a destination by its continent — every
// photo in a region folder belongs to that region, never to an unrelated one.
// The "nepal" folder has no matching destination and is therefore not mapped.
// Destinations whose continent has no folder (africa, south_america) fall
// through to their tour covers / main image.

const count = 5; // images copied per region folder

const paths = (region) =>
  Array.from({ length: count }, (_, i) => `/img/destinations/${region}/${String(i + 1).padStart(2, "0")}.jpg`);

// region folder -> ordered image paths (also usable by an exact slug entry)
export const REGION_IMAGES = {
  asia: paths("asia"),
  europe: paths("europe"),
};

// continent (as `destinationToRecord` labels it) -> region folder
const CONTINENT_REGION = {
  Asia: "asia",
  Europe: "europe",
};

// exact slug -> region folder. Empty today: the folders name regions, not the
// live destination slugs. Kept as the hook for a future single-place folder.
const SLUG_REGION = {};

/**
 * The local image paths for a destination, or [] when none apply.
 * Exact slug match wins; otherwise the continent's region folder.
 */
export function localDestinationImages(slug, continent) {
  const region = SLUG_REGION[slug] ?? CONTINENT_REGION[continent];
  return region ? [...(REGION_IMAGES[region] ?? [])] : [];
}
