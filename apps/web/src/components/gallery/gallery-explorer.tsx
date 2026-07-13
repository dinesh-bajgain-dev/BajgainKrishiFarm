"use client";

import { useState } from "react";
import { AnimatedSection } from "@/components/shared/animated-section";
import { EntityImage } from "@/components/shared/entity-image";
import { ImageLightbox, type LightboxSlide } from "@/components/shared/lightbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { resolveImageUrl } from "@/lib/api";
import { getDictionary, loc, type Locale } from "@/lib/i18n";
import type { Album, GalleryImage } from "@/types/entities";

export function GalleryExplorer({
  images,
  albums,
  locale,
}: {
  images: GalleryImage[];
  albums: Album[];
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const [albumId, setAlbumId] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Only show album tabs that actually contain photos.
  const visibleAlbums = albums.filter((album) =>
    images.some((img) => img.album_id === album.id)
  );

  const visible =
    albumId === "all" ? images : images.filter((img) => img.album_id === albumId);

  const slides: LightboxSlide[] = visible.map((img) => ({
    src: resolveImageUrl(img.image_url),
    title: loc(img, "caption", locale),
  }));

  if (images.length === 0) {
    return <p className="text-center text-muted-foreground">{dict.gallery.empty}</p>;
  }

  return (
    <div>
      {visibleAlbums.length > 0 && (
        <Tabs value={albumId} onValueChange={setAlbumId}>
          <TabsList className="h-auto flex-wrap justify-center gap-2 bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="rounded-full border border-border data-active:bg-primary data-active:text-primary-foreground"
            >
              {dict.gallery.all}
            </TabsTrigger>
            {visibleAlbums.map((album) => (
              <TabsTrigger
                key={album.id}
                value={album.id}
                className="rounded-full border border-border data-active:bg-primary data-active:text-primary-foreground"
              >
                {loc(album, "title", locale)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <div className="mt-10 columns-2 gap-4 sm:columns-3 lg:columns-4">
        {visible.map((image, i) => {
          const caption = loc(image, "caption", locale);
          return (
            <AnimatedSection key={image.id} delay={(i % 8) * 50} className="mb-4 break-inside-avoid">
              <button
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="group relative block w-full overflow-hidden rounded-2xl border border-border/60"
              >
                <EntityImage
                  src={image.image_url}
                  alt={caption}
                  width={500}
                  height={500}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-sm font-medium text-white">{caption}</p>
                  </div>
                )}
              </button>
            </AnimatedSection>
          );
        })}
      </div>

      <ImageLightbox
        slides={slides}
        index={lightboxIndex ?? 0}
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />
    </div>
  );
}
