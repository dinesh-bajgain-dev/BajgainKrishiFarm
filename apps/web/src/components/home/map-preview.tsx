import { ArrowRight, MapPin } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";
import { GoogleMapEmbed } from "@/components/shared/google-map-embed";
import { SectionHeading } from "@/components/shared/section-heading";
import { LinkButton } from "@/components/ui/link-button";
import { getDictionary, loc, type Locale } from "@/lib/i18n";
import type { FarmInfo } from "@/types/entities";

export function MapPreview({
  farmInfo,
  locale,
}: {
  farmInfo: FarmInfo | null;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  if (!farmInfo) return null;

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={dict.home.mapEyebrow}
          title={dict.home.mapTitle}
        />
        <AnimatedSection className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-center">
          <GoogleMapEmbed
            embedCode={farmInfo.google_maps_embed_code}
            label={loc(farmInfo, "farm_name", locale)}
            className="aspect-video w-full overflow-hidden rounded-2xl shadow-sm"
            placeholder="Map location will be available soon."
          />
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 size-5 shrink-0 text-primary" />
              <p className="text-lg">{loc(farmInfo, "address", locale)}</p>
            </div>
            <p className="text-muted-foreground">{dict.home.mapNote}</p>
            <LinkButton href="/location">
              {dict.common.getDirections} <ArrowRight className="size-4" />
            </LinkButton>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
