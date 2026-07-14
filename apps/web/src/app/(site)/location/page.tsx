import type { Metadata } from "next";
import { Clock, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { GoogleMapEmbed } from "@/components/shared/google-map-embed";
import { LinkButton } from "@/components/ui/link-button";
import { apiFetchOrNull } from "@/lib/api";
import { getDictionary, loc } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";
import type { FarmInfo, PageBanners } from "@/types/entities";

export const metadata: Metadata = buildPageMetadata({
  title: "Find Our Farm",
  description:
    "Directions, address, and opening hours for Bajgain Krishi Farm in Arjundhara, Jhapa, Nepal — visitors are welcome, call ahead and we'll show you around.",
  path: "/location",
  keywords: ["pig farm location Jhapa", "visit pig farm Nepal", "farm directions Arjundhara"],
});

export default async function LocationPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const [farmInfo, banners] = await Promise.all([
    apiFetchOrNull<FarmInfo>("/api/farm-info/"),
    apiFetchOrNull<PageBanners>("/api/page-banners/"),
  ]);

  const directionsUrl = farmInfo?.google_maps_embed_code
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        loc(farmInfo, "address", locale),
      )}`
    : null;

  return (
    <>
      <PageHero
        eyebrow={dict.location.eyebrow}
        title={dict.location.title}
        description={dict.location.description}
        image={banners?.location_banner_url}
      />

      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="space-y-6 lg:col-span-1">
            {farmInfo && (
              <>
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MapPin className="size-5" />
                  </span>
                  <div>
                    <p className="font-medium">{dict.common.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {loc(farmInfo, "address", locale)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Phone className="size-5" />
                  </span>
                  <div>
                    <p className="font-medium">{dict.common.phone}</p>
                    <a
                      href={`tel:${farmInfo.phone}`}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {farmInfo.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Clock className="size-5" />
                  </span>
                  <div>
                    <p className="font-medium">{dict.common.hours}</p>
                    <p className="whitespace-pre-line text-sm text-muted-foreground">
                      {loc(farmInfo, "hours", locale)}
                    </p>
                  </div>
                </div>
                {directionsUrl && (
                  <LinkButton
                    href={directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {dict.common.getDirections}
                  </LinkButton>
                )}
              </>
            )}
          </div>

          <div className="lg:col-span-2">
            {farmInfo && (
              <GoogleMapEmbed
                embedCode={farmInfo.google_maps_embed_code}
                label={loc(farmInfo, "farm_name", locale)}
                className="aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-sm lg:aspect-[16/10]"
                placeholder="Map location will be available soon."
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
