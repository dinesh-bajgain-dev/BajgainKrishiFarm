import { ArrowRight, MapPin } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { HeroBackground } from "@/components/home/hero-background";
import { getDictionary, loc, type Locale } from "@/lib/i18n";
import type { HomePage } from "@/types/entities";

export function Hero({ homePage, locale }: { homePage: HomePage | null; locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <HeroBackground imageUrl={homePage?.hero_image_url} videoUrl={homePage?.hero_video_url} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass max-w-2xl rounded-3xl p-8 sm:p-10">
          <span
            className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-accent/90 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent-foreground"
            style={{ animationDelay: "80ms" }}
          >
            <span className="pulse-dot text-emerald-300" />
            {dict.home.heroBadge}
          </span>
          <h1
            className="animate-fade-up mt-5 font-heading text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "180ms" }}
          >
            {loc(homePage, "hero_title", locale) || "Bajgain Krishi Farm"}
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-xl text-lg leading-relaxed text-white/90"
            style={{ animationDelay: "300ms" }}
          >
            {loc(homePage, "hero_subtitle", locale)}
          </p>
          <div className="animate-fade-up mt-8 flex flex-wrap gap-4" style={{ animationDelay: "420ms" }}>
            <LinkButton size="lg" href="/piglets" className="shadow-lg shadow-primary/25">
              {dict.home.seePiglets} <ArrowRight className="size-5" />
            </LinkButton>
            <LinkButton
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              href="/location"
            >
              <MapPin className="size-5" /> {dict.home.visitFarm}
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
