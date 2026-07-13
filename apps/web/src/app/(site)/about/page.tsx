import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { EntityImage } from "@/components/shared/entity-image";
import { AnimatedSection } from "@/components/shared/animated-section";
import { apiFetchOrNull } from "@/lib/api";
import { formatNumber, getDictionary, loc } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import type { AboutPage, FarmInfo, PageBanners } from "@/types/entities";

export const metadata: Metadata = {
  title: "About Our Farm",
  description: "The story of our small family pig farm and how we raise our animals.",
};

function Paragraphs({ text }: { text: string }) {
  return (
    <div className="space-y-4">
      {text.split(/\n\n+/).map((para, i) => (
        <p key={i} className="text-lg leading-relaxed text-muted-foreground">
          {para}
        </p>
      ))}
    </div>
  );
}

export default async function AboutOurFarmPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const [about, farmInfo, banners] = await Promise.all([
    apiFetchOrNull<AboutPage>("/api/about-page/"),
    apiFetchOrNull<FarmInfo>("/api/farm-info/"),
    apiFetchOrNull<PageBanners>("/api/page-banners/"),
  ]);

  return (
    <>
      <PageHero
        eyebrow={dict.about.eyebrow}
        title={dict.about.title}
        description={dict.about.description}
        image={banners?.about_banner_url}
      />

      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <AnimatedSection>
            <h2 className="font-heading text-3xl font-semibold">{dict.about.storyTitle}</h2>
            {farmInfo && (
              <p className="mt-2 text-sm font-medium uppercase tracking-wide text-primary">
                {dict.common.since} {formatNumber(farmInfo.established_year, locale)}
              </p>
            )}
            <div className="mt-6">
              <Paragraphs text={loc(about, "story", locale)} />
            </div>
          </AnimatedSection>
          <AnimatedSection delay={120}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/60 shadow-sm">
              <EntityImage
                src={about?.farm_photo_url ?? null}
                alt={dict.about.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-muted/30 py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-center font-heading text-3xl font-semibold">
              {dict.about.practicesTitle}
            </h2>
            <div className="mt-6">
              <Paragraphs text={loc(about, "practices", locale)} />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {about && (
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="flex flex-col items-center gap-8 rounded-3xl border border-border/60 bg-card p-8 shadow-sm sm:flex-row sm:p-10">
              <div className="relative size-32 shrink-0 overflow-hidden rounded-full border border-border/60 sm:size-40">
                <EntityImage
                  src={about.owner_photo_url}
                  alt={about.owner_name}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="font-heading text-2xl font-semibold">{dict.about.ownerTitle}</h2>
                <p className="mt-4 text-muted-foreground">
                  “{loc(about, "owner_message", locale)}”
                </p>
                <p className="mt-4 font-medium">— {about.owner_name}</p>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}
    </>
  );
}
