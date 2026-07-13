import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { getDictionary, type Locale } from "@/lib/i18n";

export function ContactCta({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-cta px-8 py-14 text-center text-cta-foreground sm:px-16">
          <h2 className="font-heading text-3xl font-semibold sm:text-4xl">
            {dict.home.ctaTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cta-foreground/90">
            {dict.home.ctaDescription}
          </p>
          <LinkButton size="lg" variant="secondary" className="mt-8" href="/contact">
            {dict.home.ctaButton} <ArrowRight className="size-4" />
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
