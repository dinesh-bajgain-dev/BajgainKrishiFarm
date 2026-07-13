import { AnimatedSection } from "@/components/shared/animated-section";
import { PigCard } from "@/components/pigs/pig-card";
import { apiFetchOrNull } from "@/lib/api";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { ListingType, Pig } from "@/types/entities";

/** Shared grid for the Piglets and Breeding Pigs pages. */
export async function PigListing({
  listingType,
  locale,
}: {
  listingType: ListingType;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const pigs =
    (await apiFetchOrNull<Pig[]>("/api/pigs/", {
      params: { listing_type: listingType },
    })) ?? [];

  // Available first, sold last, so fresh listings lead the page.
  const statusRank = { available: 0, reserved: 1, sold: 2 } as const;
  const sorted = [...pigs].sort(
    (a, b) => statusRank[a.status] - statusRank[b.status] || a.order - b.order
  );

  if (sorted.length === 0) {
    return (
      <p className="mx-auto max-w-xl text-center text-lg text-muted-foreground">
        {dict.listings.empty}
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sorted.map((pig, i) => (
        <AnimatedSection key={pig.id} delay={(i % 8) * 60}>
          <PigCard pig={pig} locale={locale} />
        </AnimatedSection>
      ))}
    </div>
  );
}
