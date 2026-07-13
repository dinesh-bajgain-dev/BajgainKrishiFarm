"use client";

import { useState } from "react";
import { EntityImage } from "@/components/shared/entity-image";
import { ImageLightbox } from "@/components/shared/lightbox";
import { resolveImageUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

/** Main photo + thumbnail strip for a pig listing; click opens a lightbox. */
export function PigImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const urls = images.length > 0 ? images : [null];

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="relative block aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border/60"
      >
        <EntityImage
          src={urls[selected]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </button>

      {urls.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {urls.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={cn(
                "relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors",
                i === selected ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
              )}
              aria-label={`${alt} photo ${i + 1}`}
            >
              <EntityImage src={url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <ImageLightbox
        slides={images.map((url) => ({ src: resolveImageUrl(url), title: alt }))}
        index={selected}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
