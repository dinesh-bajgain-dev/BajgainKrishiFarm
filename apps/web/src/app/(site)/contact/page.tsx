import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { GoogleMapEmbed } from "@/components/shared/google-map-embed";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { apiFetchOrNull } from "@/lib/api";
import { getDictionary, loc } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import type { FarmInfo, PageBanners } from "@/types/entities";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch to ask about our piglets, breeding pigs, or visiting the farm.",
};

export default async function ContactPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const [farmInfo, banners] = await Promise.all([
    apiFetchOrNull<FarmInfo>("/api/farm-info/"),
    apiFetchOrNull<PageBanners>("/api/page-banners/"),
  ]);

  return (
    <>
      <PageHero
        eyebrow={dict.contact.eyebrow}
        title={dict.contact.title}
        description={dict.contact.description}
        image={banners?.contact_banner_url}
      />

      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-5">
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
                  {farmInfo.whatsapp && (
                    <div className="flex items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <MessageCircle className="size-5" />
                      </span>
                      <div>
                        <p className="font-medium">{dict.common.whatsapp}</p>
                        <a
                          href={`https://wa.me/${farmInfo.whatsapp.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          {farmInfo.whatsapp}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Mail className="size-5" />
                    </span>
                    <div>
                      <p className="font-medium">{dict.common.email}</p>
                      <a
                        href={`mailto:${farmInfo.email}`}
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        {farmInfo.email}
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
                </>
              )}
            </div>

            {farmInfo && (
              <GoogleMapEmbed
                embedCode={farmInfo.google_maps_embed_code}
                label={loc(farmInfo, "farm_name", locale)}
                className="aspect-square w-full overflow-hidden rounded-2xl shadow-sm"
                placeholder="Map location will be available soon."
              />
            )}
          </div>

          <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8 lg:col-span-3">
            <h2 className="font-heading text-2xl font-semibold">
              {dict.contact.formTitle}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {dict.contact.formDescription}
            </p>
            <div className="mt-6">
              <InquiryForm locale={locale} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
