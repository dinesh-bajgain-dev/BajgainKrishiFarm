import type { FarmInfo } from "@/types/entities";

export function buildLocalBusinessJsonLd(farmInfo: FarmInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "Farm",
    name: farmInfo.farm_name_en,
    description: farmInfo.description_en,
    telephone: farmInfo.phone,
    email: farmInfo.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: farmInfo.address_en,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: farmInfo.latitude ?? undefined,
      longitude: farmInfo.longitude ?? undefined,
    },
    sameAs: [
      farmInfo.facebook_url,
      farmInfo.instagram_url,
      farmInfo.youtube_url,
      farmInfo.tiktok_url,
    ].filter(Boolean),
  };
}
