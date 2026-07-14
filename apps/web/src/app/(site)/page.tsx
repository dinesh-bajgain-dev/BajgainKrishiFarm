import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { HighlightsSection } from "@/components/home/highlights-section";
import { AvailablePigs } from "@/components/home/available-pigs";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { MapPreview } from "@/components/home/map-preview";
import { ContactCta } from "@/components/home/contact-cta";
import { JsonLd } from "@/components/shared/json-ld";
import { apiFetchOrNull } from "@/lib/api";
import { SITE_NAME } from "@/lib/constants";
import { getLocale } from "@/lib/locale";
import {
  SITE_DESCRIPTION,
  buildLocalBusinessJsonLd,
  buildPageMetadata,
  buildWebSiteJsonLd,
} from "@/lib/seo";
import type { FarmInfo, HomePage } from "@/types/entities";

export const metadata: Metadata = buildPageMetadata({
  title: `${SITE_NAME} | Piglets & Breeding Pigs`,
  description: SITE_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

export default async function Home() {
  const locale = await getLocale();
  const [farmInfo, homePage] = await Promise.all([
    apiFetchOrNull<FarmInfo>("/api/farm-info/"),
    apiFetchOrNull<HomePage>("/api/home-page/"),
  ]);

  return (
    <>
      <JsonLd data={buildWebSiteJsonLd()} />
      {farmInfo && <JsonLd data={buildLocalBusinessJsonLd(farmInfo)} />}
      <Hero homePage={homePage} locale={locale} />
      <HighlightsSection locale={locale} />
      <AvailablePigs locale={locale} />
      <GalleryPreview locale={locale} />
      <MapPreview farmInfo={farmInfo} locale={locale} />
      <ContactCta locale={locale} />
    </>
  );
}
