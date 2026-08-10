export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";

export const SITE_NAME = "Bajgain Krishi Farm";

/** Helper to determine the production site URL cleanly across local dev, Vercel deployments, and production builds. */
function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && envUrl.trim() !== "" && !envUrl.includes("localhost")) {
    return envUrl.replace(/\/$/, "");
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "")}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  if (process.env.NODE_ENV === "production") {
    return "https://bajgainkrishifarm.com.np";
  }

  return envUrl ? envUrl.replace(/\/$/, "") : "http://localhost:3000";
}

/** Public origin of the deployed site; used for canonicals, sitemap, robots, and JSON-LD. */
export const SITE_URL = getSiteUrl();

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
