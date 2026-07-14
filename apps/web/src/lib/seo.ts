import type { Metadata } from "next";
import { resolveImageUrl } from "@/lib/api";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import type { FarmInfo, Pig } from "@/types/entities";

/**
 * All metadata and structured data is emitted in English. The site serves
 * both languages from the same URLs via the locale cookie, so crawlers (which
 * carry no cookie) always see the English variant — there are no per-locale
 * URLs to declare hreflang alternates for.
 */

export const SITE_DESCRIPTION =
  "A small family pig farm in Arjundhara, Jhapa, Nepal raising healthy piglets and breeding pigs (boars and sows) for local farmers.";

/** Legacy meta keywords — ignored by Google but retained for compatibility. */
export const SITE_KEYWORDS = [
  "pig farm Nepal",
  "piglets for sale Nepal",
  "breeding pigs Nepal",
  "boars and sows Nepal",
  "pig farming Jhapa",
  "sungur farm Nepal",
  "livestock farm Arjundhara",
  SITE_NAME,
];

/** Resolves a path or app-relative image URL to an absolute URL on the public site. */
export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * The site-wide social card served by app/opengraph-image.tsx. Declared
 * explicitly on every page because defining `openGraph` in a page's metadata
 * replaces the ancestor segment's file-based images in Next's merge.
 */
const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — healthy piglets and breeding pigs from our family farm in Nepal`,
};

/**
 * Builds the shared per-page Metadata shape: unique title/description,
 * canonical URL, Open Graph, and Twitter card. `path` must be the
 * app-relative route ("/about"). Pass `absoluteTitle` for pages (home) whose
 * title should not go through the "%s | Site" template.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  absoluteTitle = false,
  ogType = "website",
  ogImages,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  absoluteTitle?: boolean;
  ogType?: "website" | "article";
  ogImages?: string[];
}): Metadata {
  const canonical = absoluteUrl(path);
  const images = ogImages ?? [DEFAULT_OG_IMAGE];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: keywords ? [...SITE_KEYWORDS, ...keywords] : SITE_KEYWORDS,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: ogType,
      locale: "en_US",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

/**
 * LocalBusiness rich result. schema.org/Farm subtypes both LocalBusiness and
 * Organization, so this single block covers all three. Fields that depend on
 * unset admin data (coordinates, socials) are omitted rather than emitted
 * empty, so the block always validates.
 */
export function buildLocalBusinessJsonLd(farmInfo: FarmInfo) {
  const sameAs = [
    farmInfo.facebook_url,
    farmInfo.instagram_url,
    farmInfo.youtube_url,
    farmInfo.tiktok_url,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Farm",
    "@id": `${SITE_URL}/#farm`,
    name: farmInfo.farm_name_en,
    description: farmInfo.description_en.trim(),
    url: SITE_URL,
    image: absoluteUrl("/opengraph-image"),
    telephone: farmInfo.phone,
    email: farmInfo.email,
    foundingDate: String(farmInfo.established_year),
    address: {
      "@type": "PostalAddress",
      streetAddress: farmInfo.address_en,
      addressCountry: "NP",
    },
    ...(farmInfo.latitude != null && farmInfo.longitude != null
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: farmInfo.latitude,
            longitude: farmInfo.longitude,
          },
          hasMap: `https://www.google.com/maps?q=${farmInfo.latitude},${farmInfo.longitude}`,
        }
      : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/** WebSite rich result, linked to the farm as publisher. */
export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#farm` },
  };
}

/** BreadcrumbList rich result. Items are ordered root-first. */
export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

const PIG_AVAILABILITY: Record<Pig["status"], string> = {
  available: "https://schema.org/InStock",
  reserved: "https://schema.org/SoldOut",
  sold: "https://schema.org/SoldOut",
};

/**
 * Product rich result for a pig listing. The offer is omitted entirely when
 * the pig has no listed price ("Contact for price") — schema.org offers
 * require a numeric price.
 */
export function buildPigProductJsonLd(pig: Pig) {
  const images = pig.image_urls
    .map((url) => resolveImageUrl(url))
    .map((url) => absoluteUrl(url));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pig.name_en,
    description: pig.description_en || `${pig.breed_en} ${pig.listing_type} from ${SITE_NAME}`,
    ...(images.length > 0 ? { image: images } : {}),
    category: "Livestock",
    brand: { "@id": `${SITE_URL}/#farm` },
    ...(pig.price != null
      ? {
          offers: {
            "@type": "Offer",
            price: pig.price,
            priceCurrency: "NPR",
            availability: PIG_AVAILABILITY[pig.status],
            url: absoluteUrl(`/pigs/${pig.id}`),
            seller: { "@id": `${SITE_URL}/#farm` },
          },
        }
      : {}),
  };
}
