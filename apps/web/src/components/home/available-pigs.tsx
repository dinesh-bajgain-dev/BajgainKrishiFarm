import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionHeading } from "@/components/shared/section-heading";
import { PigCard } from "@/components/pigs/pig-card";
import { LinkButton } from "@/components/ui/link-button";
import { apiFetchOrNull } from "@/lib/api";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { Pig } from "@/types/entities";

export async function AvailablePigs({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const pigs = (await apiFetchOrNull<Pig[]>("/api/pigs/")) ?? [];
  const available = pigs.filter((pig) => pig.status === "available").slice(0, 4);

  return (
    <section className="bg-muted/30 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={dict.home.availableEyebrow}
          title={dict.home.availableTitle}
          description={dict.home.availableDescription}
        />

        {available.length === 0 ? (
          <p className="mt-10 text-center text-muted-foreground">{dict.home.emptyPigs}</p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {available.map((pig, i) => (
              <AnimatedSection key={pig.id} delay={i * 80}>
                <PigCard pig={pig} locale={locale} />
              </AnimatedSection>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <LinkButton href="/piglets">
            {dict.home.viewPiglets} <ArrowRight className="size-4" />
          </LinkButton>
          <LinkButton variant="outline" href="/breeding-pigs">
            {dict.home.viewBreeding} <ArrowRight className="size-4" />
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
