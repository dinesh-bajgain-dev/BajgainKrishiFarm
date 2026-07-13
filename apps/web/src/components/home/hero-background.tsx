"use client";

import { useState } from "react";
import { EntityImage } from "@/components/shared/entity-image";
import { resolveImageUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

/**
 * Hero banner background: a looping silent video when one is set, with the
 * banner photo as a fallback for prefers-reduced-motion visitors, slow
 * connections (poster frame), and in case the video file fails to load.
 */
export function HeroBackground({
  imageUrl,
  videoUrl,
}: {
  imageUrl: string | null | undefined;
  videoUrl: string | null | undefined;
}) {
  const [videoFailed, setVideoFailed] = useState(false);
  const showVideo = Boolean(videoUrl) && !videoFailed;

  return (
    <>
      <EntityImage
        src={imageUrl}
        alt=""
        fill
        priority
        sizes="100vw"
        className={cn("animate-hero-zoom object-cover", showVideo && "motion-safe:hidden")}
      />
      {showVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 size-full object-cover motion-reduce:hidden"
          onError={() => setVideoFailed(true)}
        >
          <source src={resolveImageUrl(videoUrl)} />
        </video>
      )}
    </>
  );
}
