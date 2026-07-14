import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ArrowLeft } from "lucide-react";
import { PigImageGallery } from "@/components/pigs/pig-image-gallery";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { JsonLd } from "@/components/shared/json-ld";
import { apiFetchOrNull, resolveImageUrl } from "@/lib/api";
import { SITE_NAME } from "@/lib/constants";
import { formatAge, formatPrice, getDictionary, loc } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { buildBreadcrumbJsonLd, buildPageMetadata, buildPigProductJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { Pig } from "@/types/entities";

const STATUS_STYLES: Record<Pig["status"], string> = {
  available: "bg-emerald-600 text-white",
  reserved: "bg-amber-500 text-white",
  sold: "bg-zinc-500 text-white",
};

// Memoized so generateMetadata and the page body share one API request.
const getPig = cache((id: string) => apiFetchOrNull<Pig>(`/api/pigs/${id}`));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const pig = await getPig(id);
  if (!pig) return { title: "Pig Not Found", robots: { index: false } };

  const listingLabel = pig.listing_type === "piglet" ? "Piglet" : "Breeding Pig";
  const description = (
    pig.description_en.trim() ||
    `${pig.breed_en} ${listingLabel.toLowerCase()} from ${SITE_NAME}, a small family pig farm in Arjundhara, Nepal.`
  ).slice(0, 160);
  // Real photos only — with none, the site-wide OG image applies instead.
  const photo = pig.image_urls.length > 0 ? resolveImageUrl(pig.image_urls[0]) : null;

  return buildPageMetadata({
    title: `${pig.name_en} — ${pig.breed_en} ${listingLabel}`,
    description,
    path: `/pigs/${pig.id}`,
    keywords: [pig.breed_en, `${pig.breed_en} ${listingLabel.toLowerCase()} Nepal`],
    ...(photo && !photo.endsWith(".svg") ? { ogImages: [photo] } : {}),
  });
}

export default async function PigDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const pig = await getPig(id);
  if (!pig) notFound();

  const backHref = pig.listing_type === "piglet" ? "/piglets" : "/breeding-pigs";
  const backLabel = pig.listing_type === "piglet" ? dict.nav.piglets : dict.nav.breedingPigs;
  const age = formatAge(pig.date_of_birth, locale);
  const description = loc(pig, "description", locale);
  const name = loc(pig, "name", locale);
  const breed = loc(pig, "breed", locale);

  const facts = [
    { label: dict.pig.breed, value: breed },
    { label: dict.pig.gender, value: dict.pig[pig.gender] },
    ...(age ? [{ label: dict.pig.age, value: age }] : []),
    { label: dict.pig.price, value: formatPrice(pig.price, locale) },
  ];

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <JsonLd data={buildPigProductJsonLd(pig)} />
        <JsonLd
          data={buildBreadcrumbJsonLd([
            { name: dict.nav.home, path: "/" },
            { name: backLabel, path: backHref },
            { name, path: `/pigs/${pig.id}` },
          ])}
        />
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4" />
          {dict.listings.back}
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <PigImageGallery images={pig.image_urls} alt={name} />

          <div>
            <span
              className={cn(
                "inline-block rounded-full px-3 py-1 text-xs font-semibold",
                STATUS_STYLES[pig.status]
              )}
            >
              {dict.pig[pig.status]}
            </span>
            <h1 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">{name}</h1>
            <p className="mt-1 text-muted-foreground">
              {dict.pig[pig.listing_type]}
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-4">
              {facts.map((fact) => (
                <div key={fact.label} className="rounded-2xl border border-border/60 bg-card p-4">
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 font-semibold">{fact.value}</dd>
                </div>
              ))}
            </dl>

            {description && (
              <div className="mt-8">
                <h2 className="font-heading text-xl font-semibold">{dict.listings.aboutPig}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 max-w-3xl rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
          <h2 className="font-heading text-2xl font-semibold">{dict.listings.inquiryTitle}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{dict.listings.inquiryDescription}</p>
          <div className="mt-6">
            <InquiryForm locale={locale} defaultPigId={pig.id} defaultPigName={name} />
          </div>
        </div>
      </div>
    </section>
  );
}
