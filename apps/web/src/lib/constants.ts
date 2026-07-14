export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";

export const SITE_NAME = "Bajgain Krishi Farm";

/** Public origin of the deployed site; used for canonicals, sitemap, robots, and JSON-LD. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** hrefs for the public site nav; labels come from the locale dictionary. */
export const NAV_KEYS = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/piglets", key: "piglets" },
  { href: "/breeding-pigs", key: "breedingPigs" },
  { href: "/gallery", key: "gallery" },
  { href: "/location", key: "location" },
  { href: "/contact", key: "contact" },
] as const;

export type NavKey = (typeof NAV_KEYS)[number]["key"];
