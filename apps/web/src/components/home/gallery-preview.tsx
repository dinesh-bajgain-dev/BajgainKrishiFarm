import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";
import { EntityImage } from "@/components/shared/entity-image";
import { SectionHeading } from "@/components/shared/section-heading";
import { LinkButton } from "@/components/ui/link-button";
import { apiFetchOrNull } from "@/lib/api";
import { getDictionary, loc, type Locale } from "@/lib/i18n";
import type { GalleryImage } from "@/types/entities";

export async function GalleryPreview({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const images = (await apiFetchOrNull<GalleryImage[]>("/api/gallery/")) ?? [];
  const preview = images.slice(0, 6);

  if (preview.length === 0) return null;

  return (
    <section className="bg-muted/30 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow={dict.home.galleryEyebrow}
            title={dict.home.galleryTitle}
            description={dict.home.galleryDescription}
            className="mx-0"
          />
          <LinkButton variant="outline" className="shrink-0" href="/gallery">
            {dict.home.viewGallery} <ArrowRight className="size-4" />
          </LinkButton>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {preview.map((image, i) => (
            <AnimatedSection key={image.id} delay={i * 60}>
              <Link
                href="/gallery"
                className="group relative block aspect-square overflow-hidden rounded-2xl border border-border/60"
              >
                <EntityImage
                  src={image.image_url}
                  alt={loc(image, "caption", locale)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(min-width: 1024px) 16vw, 33vw"
                />
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
