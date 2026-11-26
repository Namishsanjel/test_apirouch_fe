// The site's canonical origin. No production domain is defined anywhere in
// this project yet, so it falls back to the origin the app is served from at
// runtime (dev, preview, or whatever domain it finally ships to). A build can
// pin the real origin without a code change:
//   VITE_SITE_ORIGIN=https://www.your-domain.com npm run build
// Only define it here — every consumer must import it from this file.
export const SITE_URL = (
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_SITE_ORIGIN) ||
  (typeof window !== "undefined" ? window.location.origin : "")
).replace(/\/+$/, "");

// CMS-backed cards (hikes / experience / journal) all resolve to one picsum
// seed in the hydrated DOM, so that single seed is used for every one of them.

export const IMG = {
  // The single local logo (see src/lib/brand.js, which owns the path). Both
  // slots point at it: the mark is dark navy and is used as-is on every
  // surface, so there is no separate white variant any more.
  logo: "/logo.png",
  logoDark: "/logo.png",
  hero: "/img/homepage/hero.jpeg",
  contact: "/img/SKEOxyccXWzDnPBCqes8OKxWFE-36b270.jpg",
  about: "/img/homepage/aboutusmain.jpeg",
  polaroid1: "/img/STbQ0TTQSrsZiFejlw0ISo8f8Cg-d589c2.png",
  polaroid2: "/img/kyESw1RHyMdsAjTFdft5SBan1g-37340a.png",
  polaroid3: "/img/VrrJ1dN3SN22nkPBDkuTXuLC8-d589c2.png",
  cms: "https://picsum.photos/seed/apitouch-1WphCNug7C7HhqPwXrQTT0M2KE97bd/900/700",
  included100: "/img/b8N0lZkrOvU8l5k66vVr97WwF6M-a6d13a.png",
  includedTransfers: "/img/3GCyVYdlNAmCVUUaBGEwCGt3LYc-a6d13a.png",
  guide: "/img/9LRjdvq7qodL0yYahLpqgygYuk-c022b9.png",
  testimonial: "/img/Lb7a9F2Y442x6WewlTOqDC6JVF0-784858.png",
  avatar1: "/img/Tb2IyWFVhCYJMmLVbyfHF949LoQ-cd2d3e.png",
  avatar2: "/img/rminNLvD1Ra33ajEBBIbdkyDw-cd2d3e.png",
  footer: "/img/homepage/footer.jpeg",
};

/**
 * The single source of truth for the agency's contact details. Every place
 * that shows, links to, or embeds (JSON-LD) a phone or email reads from here,
 * so updating a number or address is a one-file change.
 *
 * `tel:`/`mailto:` hrefs are derived from the readable values below, with the
 * spaces and dashes stripped, so the visible text stays readable while the
 * link is machine-usable. The landline keeps its country code for dialling.
 */
const PHONE_MOBILES = ["+977 9861189565", "+977 9810268276", "+977 9841332053"];
const PHONE_LANDLINE = "01-4500157";
const EMAIL = "apitouch123@gmail.com";
const LOCATION = "Kathmandu, Nepal";

const telHref = (value) => `tel:${value.replace(/[^+\d]/g, "")}`;

export const CONTACT_DETAILS = {
  email: EMAIL,
  emailHref: `mailto:${EMAIL}`,
  // International dialling form of the landline, so a tel: link works abroad.
  landline: PHONE_LANDLINE,
  landlineHref: telHref("+977 1 4500157"),
  mobiles: PHONE_MOBILES,
  mobileHrefs: PHONE_MOBILES.map(telHref),
  location: LOCATION,
  // Readable phone lines for layouts with room: one mobile per line, then the
  // landline, so all of them are shown rather than just the first.
  phones: [...PHONE_MOBILES, PHONE_LANDLINE],
  phoneHrefs: [...PHONE_MOBILES.map(telHref), telHref("+977 1 4500157")],
  // The single number for tight spots (small cards, single-line contexts).
  primaryPhone: PHONE_MOBILES[0],
  primaryPhoneHref: telHref(PHONE_MOBILES[0]),
};

export const CONTACT = {
  badge: "Contact us",
  title: ["Let's plan your", "next adventure"],
  image: IMG.contact,
  imageAlt: "Misty forest road background for the AP",
  info: [
    { label: "Email", value: CONTACT_DETAILS.email, href: CONTACT_DETAILS.emailHref },
    { label: "Phone", value: CONTACT_DETAILS.phones, hrefs: CONTACT_DETAILS.phoneHrefs },
    { label: "Location", value: CONTACT_DETAILS.location },
    { label: "Response Time", value: "We reply within 24 hours" },
  ],
  form: {
    name: { label: "Full Name", placeholder: "Your name" },
    email: { label: "Email", placeholder: "Your email" },
    hike: {
      label: "Which tour are you thinking about?",
      options: [
        "Annapurna Base Camp",
        "Inca Trail to Machu Picchu",
        "Mount Kilimanjaro",
        "Cinque Terre Coastal Trail",
        "Black Forest Ridge Trail",
        "Milford Track",
        "Torres del Paine Circuit",
        "Tour du Mont Blanc",
        "West Highland Way",
        "Laugavegur Trail",
      ],
    },
    date: { label: "When are you thinking of going?" },
    message: { label: "Message", placeholder: "Tell us about your adventure" },
    submit: "Submit",
  },
};

// Per-route document head.
export const PAGES = {
  "/": {
    title: "API Touch — Guided Tours & Vacations",
    description:
      "Discover guided tours, scenic destinations, curated travel experiences, and stress-free holiday planning with API Touch.",
  },
  "/contact": {
    title: "Contact API Touch — Plan Your Next Vacation",
    description:
      "Contact API Touch to plan a guided tour, ask about itineraries, group sizes, dates, and travel support.",
  },
  "/about": {
    title: "About API Touch — Our Story & Guides",
    description:
      "Learn about API Touch’s approach to guided tours, curated itineraries, local expertise, and thoughtful travel planning.",
  },
  "/gallery": {
    title: "Travel Photo Gallery — API Touch",
    description:
      "Explore API Touch’s travel photo gallery with scenic destinations, stays, and memorable moments from guided trips.",
  },
  "/blog": {
    title: "Blog & Travel Guide, Trip Stories & Tips — API Touch",
    description:
      "Travel guides, packing tips, and stories from the road. Inspiration for your next guided adventure.",
  },
  "/tours": {
    title: "Tours & Packages — API Touch",
    description:
      "Browse every API Touch tour and travel package, filtered by destination, duration, budget and travel type.",
  },
  "/destinations": {
    title: "Destinations — API Touch",
    description:
      "Explore the destinations API Touch operates in, organised by location, with attractions, activities and tour packages.",
  },
  "/experiences": {
    title: "Experiences — API Touch",
    description:
      "Browse trips by travel purpose — adventure, culture, wildlife, pilgrimage, honeymoon and family travel.",
  },
  "/services": {
    title: "Travel Services — API Touch",
    description:
      "Hotel booking, flight tickets, transportation, visa assistance, permits and travel insurance, arranged before you leave home.",
  },
  "/legal": {
    title: "Legal Documents — API Touch",
    description:
      "View and download API Touch's official legal documents, including PAN and Tours & Travels registration details.",
  },
  "/plan-your-trip": {
    title: "Plan Your Trip — API Touch",
    description:
      "Send API Touch your destination, dates, group size, preferences and budget, and get an itinerary and a price back.",
  },
  "/why-apitouch": {
    title: "Why API Touch — Local Expertise & Small Groups",
    description:
      "Local expertise, personalized service, experienced guides, safety and support — what sets every API Touch trip apart.",
  },
  "/reviews": {
    title: "Reviews — API Touch",
    description:
      "Customer testimonials and traveller experiences from API Touch tours and guided vacations.",
  },
  "/faq": {
    title: "FAQ — API Touch",
    description:
      "Answers about bookings, payments, cancellations, visas, accommodation, transportation and travel with API Touch.",
  },
};

// `menu: "destinations"` marks the one entry that opens the nav mega-menu
// instead of navigating (the panel itself links through to the page).
export const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Destinations", href: "/destinations", menu: "destinations" },
  { label: "Our Package", href: "/tours", menu: "packages" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
export const HERO = {
  eyebrow: "Global Journeys · Set to Wander",
  title: "Go Where the Journey Begins",
  cta: "Find your next tour",
  ctaHref: "/tours",
  sub: "Guided journeys to wild landscapes, hidden coastlines, and places few ever reach.",
  image: IMG.hero,
  imageAlt: "Traveller overlooking a coastal bay and hills at golden hour",
};

export const ABOUT = {
  badge: "About us",
  title: ["Uncover the", "Stories Hidden in", "Every Landscape"],
  body: "API Touch is a tour operator built for people who want to go further. Small groups, expert local guides, and places most people never find on their own.",
  cta: "Our story",
  ctaHref: "/about",
  stats: [
    { label: "Years running", value: "12+ years" },
    { label: "Miles Explored", value: "5000+" },
    { label: "Destinations", value: "38 worldwide" },
  ],
  image: IMG.about,
  cardTitle: "Every trip, a new story",
  cardBody: "From coast to countryside — every journey has something to say.",
  polaroids: [IMG.polaroid1, IMG.polaroid2, IMG.polaroid3],
};

export const HIKES_SECTION = {
  badge: "Our tours",
  title: ["Discover What Awaits", "Beyond the Path"],
  body: "From hidden valleys to iconic destinations, explore tours designed for curious minds and adventurous spirits.",
  cta: "Browse all tours",
  ctaHref: "/tours",
};

export const HIKES = [
  {
    slug: "annapurna-base-camp",
    chips: ["Moderate", "5 Days"],
    title: "Annapurna Base Camp",
    href: "/tours/annapurna-base-camp",
    image: "/img/abc.jpg",
    alt: "Annapurna Base Camp tour photo showing scenic views",
  },
  {
    slug: "inca-tour-machu-picchu",
    chips: ["Tough", "4 Days"],
    title: "Inca Trail to Machu Picchu",
    href: "/tours/inca-tour-machu-picchu",
    image: "/img/machu-picchu.jpg",
    alt: "Inca Trail to Machu Picchu guided tour",
  },
  {
    slug: "cinque-terre-coast",
    chips: ["Easy", "3 Days"],
    title: "Cinque Terre Coastal Trail",
    href: "/tours/cinque-terre-coast",
    image: "/img/cinque-terre-coastal-trail.jpg",
    alt: "Cinque Terre Coastal Trail guided tour",
  },
  {
    slug: "mount-kilimanjaro",
    chips: ["Tough", "6 Days"],
    title: "Mount Kilimanjaro",
    href: "/tours/mount-kilimanjaro",
    image: "/img/mount-kilimanjaro.jpg",
    alt: "Mount Kilimanjaro guided tour hero image",
  },
];

// Alternating "Our destinations" rows: image on one side, heading + copy on the other.
export const DESTINATIONS_SECTION = {
  badge: "Our destinations",
  title: ["Places worth", "the journey"],
  body: "The corners of the map where we run our smallest groups. Pick the destination first — the itinerary, the pace and the places you stay get built around it.",
};

export const INCLUDED_SECTION = {
  badge: "What's included",
  title: ["What makes the", "experience different"],
  body: "From local guides and door-to-door transfers to meals, stays, and small groups, every detail is thoughtfully arranged before you arrive.",
};

// Feature (mist) cards: icon + heading + copy
export const INCLUDED_FEATURES = {
  guiding: { icon: "2784223275", title: "Guiding", body: "A local lead on every itinerary, start to finish" },
  gear: { icon: "1118047839", title: "Equipment", body: "Tents, mats and cookware, already packed" },
  meals: { icon: "50407791", title: "Meals", body: "Fresh meals and snacks, ready every day" },
  groups: { icon: "2109778876", title: "Small groups", body: "Never more than 8 travellers per guide, every time" },
};

// Photo cards: image + heading + one-line caption
export const INCLUDED_PHOTOS = {
  transfers: { image: IMG.includedTransfers, title: "Transfers", body: "Door to door, no detours" },
  always: { image: IMG.included100, title: "100%", body: "Local guides on every trip" },
};

export const EXPERIENCE_SECTION = {
  badge: "Experience",
  title: ["See what the", "journey feels like"],
  body: "Every photo captures part of the journey—the people, places, and moments that make every adventure worth remembering.",
  cta: "See More Moments",
  ctaHref: "/gallery",
};

export const EXPERIENCE_IMAGES = [
  { src: IMG.cms, alt: "" },
  { src: IMG.cms, alt: "" },
  { src: IMG.cms, alt: "" },
  { src: IMG.cms, alt: "" },
];

export const GUIDE_SECTION = {
  badge: "Who are we",
  title: ["Meet the people", "behind the path"],
  // About/home "Meet the people" section copy. Kept separate from body1, which
  // the Why page still renders verbatim (its /why-apitouch blurb reuses body1).
  sectionBody1: "Our travel experts have spent years exploring these destinations, long before it became their profession. They know how to match the right itinerary to your pace, interests, and preferences — whether it's your first multi-day holiday or your tenth.",
  sectionBody2: "Every journey is tailored to the people taking it. First-time travellers receive thoughtful guidance and support at every step, while experienced explorers enjoy greater flexibility, independence, and opportunities to discover more. Whatever your travel style, you're travelling with someone who knows the destination inside and out.",
  body1: "Our guides grew up exploring these regions, long before it was a job. They know which itinerary fits your pace and what you actually need along the way — whether it's your first multi-day tour or your tenth.",
  body2: "They adjust to whoever shows up. Beginners get the full walkthrough, no assumptions made. Experienced travellers get pushed further, faster, with less hand-holding. Either way, you're out there with someone who knows the ground.",
  points: [
    { icon: "2327548604", title: "WFR-Certified", body: "Certified guides, 5+ years leading multi-day tours." },
    { icon: "535953797", title: "Small groups", body: "Max 8 travellers per guide. Real attention on the journey." },
  ],
  // Read by the Why page's small "meet us" thumbnail; the Home section below
  // has its own pair, so replacing one does not affect the other.
  image: IMG.guide,
  imageAlt: "API Touch travel guide preview showing c",
  storyImage: "/img/whoarewe.jpeg",
  storyImageAlt: "The API Touch team outdoors",
};

export const SERVICES_SECTION = {
  badge: "Services",
  title: ["Everything sorted", "before you go"],
  body: "Three things every trip needs, taken off your list — visas, flights and rooms booked, confirmed, and sent to you as one itinerary.",
  cta: "Plan your tour",
  ctaHref: "/plan-your-trip",
};

export const SERVICES = [
  {
    icon: "2327548604",
    title: "Visas",
    body: "Your passport checked against every entry rule for your itinerary, then the applications lodged — visas, transit stops and permits, all of it before you book anything else.",
  },
  {
    icon: "1403532491",
    title: "Air Ticketing",
    body: "Flights shaped around your itinerary: a day of buffer before day one, and layovers that leave room for delayed bags or a missed connection.",
  },
  {
    icon: "4159562592",
    title: "Hotel Booking",
    body: "Pre- and post-tour stays in the quiet, central rooms we use every season — reserved, paid and confirmed with your dates before you leave home.",
  },
];

export const TESTIMONIAL_SECTION = {
  badge: "Testimonials",
  title: ["The memories speak", "for themselves"],
  body: "Honest reflections from people who travelled with API Touch and experienced it for themselves, creating memories that truly last.",
};

export const FEATURED_QUOTE = {
  quote: "\"I came for the views, but I left with memories I'll never forget. Every itinerary, every viewpoint, and every conversation made this journey feel truly special.\"",
  name: "Emily Carter",
  trip: "Milford Track",
  image: IMG.testimonial,
};

export const REVIEWS = [
  {
    title: "Every step felt worth it",
    body: "I've done plenty of tours before, but this one stood out. The itinerary was stunning, the guide knew every hidden viewpoint, and the small group made it easy to connect with everyone. It felt less like a package and more like an adventure with friends",
    name: "Sofia Williams",
    trip: "Annapurna Base Camp",
    avatar: IMG.avatar1,
  },
  {
    title: "Memories that stayed with me",
    body: "Watching the sunrise from the viewpoint was unforgettable, but what made the trip special was the people. The guide created such a welcoming atmosphere that even solo travelers felt like part of the group from day one.",
    name: "Liam Carter",
    trip: "Mount Kilimanjaro",
    avatar: IMG.avatar2,
  },
];

export const JOURNAL_SECTION = {
  badge: "Travel Journal",
  title: ["Stories, Tips &", "Travel inspiration"],
  body: "Explore travel guides, tips, destination highlights, and outdoor stories to inspire your next adventure.",
  cta: "Explore Journal",
  ctaHref: "/blog",
};

export const JOURNAL = [
  {
    tags: ["guide notes", "3 min read"],
    title: "What we tell you before day one",
    href: "/blog/what-we-tell-you-before-day-one",
    image: IMG.cms,
    alt: "Guide reviewing a paper map with a small",
  },
  {
    tags: ["guide notes", "4 min read"],
    title: "Why the same itinerary feels different every season",
    href: "/blog/why-the-same-route-feels-different-every-season",
    image: IMG.cms,
    alt: "Seasonal shift along a familiar path on ",
  },
  {
    tags: ["guide notes", "4 min read"],
    title: "The equipment we replace every year",
    href: "/blog/the-gear-we-replace-every-year",
    image: IMG.cms,
    alt: "Guide travel equipment including rope and first-aid supplies",
  },
];

export const FAQ_SECTION = {
  badge: "FAQ",
  title: ["Good to know", "before you go"],
  body: "From packing lists to tour difficulty, here's everything you need to feel prepared.",
  cta: "Get in touch",
  ctaHref: "/contact",
};

export const FAQS = [
  { q: "How experienced do I need to be?", a: "If you can walk a few hours on uneven ground, you're ready." },
  { q: "How many people are in a group?", a: "Usually 6 to 8— small enough to stay quiet." },
  { q: "What should I bring?", a: "A packing list goes out once you book, built around the season ahead." },
  { q: "What happens if the weather turns?", a: "Guides know the alternate itineraries and adjust the day." },
  { q: "Can I change my dates after booking?", a: "Yes, up to 14 days before departure, no extra cost." },
];

export const FOOTER = {
  title: ["Your next adventure", "starts here"],
  body: "Explore remote landscapes, local stories, and unforgettable moments waiting just around the corner.",
  cta: "Explore Tours",
  ctaHref: "/tours",
  background: IMG.footer,
  backgroundAlt: "Traveller resting on a scenic path with a backpack",
  subline: "Guided tours, breathtaking destinations, and unforgettable moments—all thoughtfully crafted in one place.",
  copyright: "© 2026 API Touch",
  columns: [
    { label: "Navigation", links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Our team", href: "/about#our-guides" },
    ] },
    { label: "CMS", links: [
      { label: "Tours", href: "/tours" },
      { label: "Services", href: "/services" },
      { label: "Gallery", href: "/gallery" },
      { label: "Blog", href: "/blog" },
    ] },
    { label: "Legal page", links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms Of Service", href: "/terms-of-service" },
      { label: "Cancellation Policy", href: "/cancellation-refund" },
      { label: "Legal doc", href: "/legal" },
    ] },
    // `href: null` marks a link whose destination does not exist yet — the
    // footer renders it as a disabled placeholder instead of a live anchor.
    { label: "Social", links: [
      { label: "Facebook", href: null },
      { label: "Instagram", href: null },
      { label: "YouTube", href: null },
      { label: "LinkedIn", href: null },
      { label: "TikTok", href: null },
    ] },
  ],
};
