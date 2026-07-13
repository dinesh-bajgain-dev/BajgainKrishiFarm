"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { FALLBACK_IMAGE_URL, resolveImageUrl } from "@/lib/api";

/**
 * Renders admin-managed images (uploads served by the FastAPI backend, or the
 * bundled fallback graphic). `unoptimized` is required here: in local dev the
 * backend is on localhost, and Next's image optimizer refuses to fetch
 * upstream images that resolve to a private/loopback IP (SSRF protection). In
 * production the backend would be a real domain, but these images are
 * already reasonably sized, so skipping the optimizer is a fine tradeoff.
 *
 * If the saved URL 404s (e.g. the uploaded file was deleted from disk), this
 * falls back to the bundled placeholder graphic instead of a broken-image
 * icon.
 */
export function EntityImage({
  src,
  alt,
  ...props
}: { src: string | null | undefined; alt: string } & Omit<ImageProps, "src" | "alt">) {
  const [failed, setFailed] = useState(false);
  const resolved = failed ? FALLBACK_IMAGE_URL : resolveImageUrl(src);

  return (
    <Image
      src={resolved}
      alt={alt}
      unoptimized
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
