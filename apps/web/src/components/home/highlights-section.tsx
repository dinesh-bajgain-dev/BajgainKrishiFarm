import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionHeading } from "@/components/shared/section-heading";
import { HIGHLIGHT_ICONS } from "@/components/shared/highlight-icons";
import { PiggyBank } from "lucide-react";
import { apiFetchOrNull } from "@/lib/api";
import { getDictionary, loc, type Locale } from "@/lib/i18n";
import type { Highlight } from "@/types/entities";

export async function HighlightsSection({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const highlights = (await apiFetchOrNull<Highlight[]>("/api/highlights/")) ?? [];

  if (highlights.length === 0) return null;

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={dict.home.highlightsEyebrow}
          title={dict.home.highlightsTitle}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((highlight, i) => {
            const Icon = HIGHLIGHT_ICONS[highlight.icon] ?? PiggyBank;
            return (
              <AnimatedSection key={highlight.id} delay={i * 80} className="h-full">
                <div className="card-lift group h-full rounded-3xl border border-border/60 bg-card p-6 shadow-sm hover:border-primary/30 sm:p-8">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-5 font-heading text-xl font-semibold">
                    {loc(highlight, "title", locale)}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {loc(highlight, "description", locale)}
                  </p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
