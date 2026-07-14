import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { PigListing } from "@/components/pigs/pig-listing";
import { apiFetchOrNull } from "@/lib/api";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";
import type { PageBanners } from "@/types/entities";

export const metadata: Metadata = buildPageMetadata({
  title: "Available Breeding Pigs",
  description:
    "Quality boars and sows for sale from our family farm in Arjundhara, Nepal — healthy breeding stock for starting or growing your own herd.",
  path: "/breeding-pigs",
  keywords: ["breeding pigs for sale", "boars and sows Nepal", "pig breeding stock Jhapa"],
});

export default async function BreedingPigsPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const banners = await apiFetchOrNull<PageBanners>("/api/page-banners/");

  return (
    <>
      <PageHero
        eyebrow={dict.listings.breedingEyebrow}
        title={dict.listings.breedingTitle}
        description={dict.listings.breedingDescription}
        image={banners?.breeding_banner_url}
      />
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PigListing listingType="breeding" locale={locale} />
        </div>
      </section>
    </>
  );
}
