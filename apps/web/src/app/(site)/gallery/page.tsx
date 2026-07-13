import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { GalleryExplorer } from "@/components/gallery/gallery-explorer";
import { apiFetchOrNull } from "@/lib/api";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import type { Album, GalleryImage, PageBanners } from "@/types/entities";

export const metadata: Metadata = {
  title: "Farm Gallery",
  description: "Photos of our pigs and everyday life around the farm.",
};

export default async function GalleryPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const [images, albums, banners] = await Promise.all([
    apiFetchOrNull<GalleryImage[]>("/api/gallery/"),
    apiFetchOrNull<Album[]>("/api/albums/"),
    apiFetchOrNull<PageBanners>("/api/page-banners/"),
  ]);

  return (
    <>
      <PageHero
        eyebrow={dict.gallery.eyebrow}
        title={dict.gallery.title}
        description={dict.gallery.description}
        image={banners?.gallery_banner_url}
      />
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <GalleryExplorer images={images ?? []} albums={albums ?? []} locale={locale} />
        </div>
      </section>
    </>
  );
}
