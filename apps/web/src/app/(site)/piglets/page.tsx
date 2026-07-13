import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { PigListing } from "@/components/pigs/pig-listing";
import { apiFetchOrNull } from "@/lib/api";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import type { PageBanners } from "@/types/entities";

export const metadata: Metadata = {
  title: "Available Piglets",
  description: "Healthy, weaned piglets from our small family farm, ready for their new homes.",
};

export default async function PigletsPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const banners = await apiFetchOrNull<PageBanners>("/api/page-banners/");

  return (
    <>
      <PageHero
        eyebrow={dict.listings.pigletsEyebrow}
        title={dict.listings.pigletsTitle}
        description={dict.listings.pigletsDescription}
        image={banners?.piglets_banner_url}
      />
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PigListing listingType="piglet" locale={locale} />
        </div>
      </section>
    </>
  );
}
