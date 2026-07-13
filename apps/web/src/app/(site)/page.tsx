import { Hero } from "@/components/home/hero";
import { HighlightsSection } from "@/components/home/highlights-section";
import { AvailablePigs } from "@/components/home/available-pigs";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { MapPreview } from "@/components/home/map-preview";
import { ContactCta } from "@/components/home/contact-cta";
import { apiFetchOrNull } from "@/lib/api";
import { getLocale } from "@/lib/locale";
import { buildLocalBusinessJsonLd } from "@/lib/seo";
import type { FarmInfo, HomePage } from "@/types/entities";

export default async function Home() {
  const locale = await getLocale();
  const [farmInfo, homePage] = await Promise.all([
    apiFetchOrNull<FarmInfo>("/api/farm-info/"),
    apiFetchOrNull<HomePage>("/api/home-page/"),
  ]);
  const jsonLd = farmInfo ? buildLocalBusinessJsonLd(farmInfo) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Hero homePage={homePage} locale={locale} />
      <HighlightsSection locale={locale} />
      <AvailablePigs locale={locale} />
      <GalleryPreview locale={locale} />
      <MapPreview farmInfo={farmInfo} locale={locale} />
      <ContactCta locale={locale} />
    </>
  );
}
