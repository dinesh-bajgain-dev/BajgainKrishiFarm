import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION } from "@/lib/seo";
import { SITE_NAME } from "@/lib/constants";

/**
 * Web App Manifest for Bajgain Krishi Farm.
 *
 * Next.js App Router automatically serves this at /manifest.webmanifest and
 * injects the corresponding <link rel="manifest"> into every page's <head>.
 *
 * Icon strategy: we reuse the existing /favicon.svg rather than generating
 * duplicate raster copies. Modern browsers and Chrome's PWA installer accept
 * SVG icons.
 *
 * Colors are taken from the Viewport declared in layout.tsx:
 *   Light theme_color / background_color: #faf6ef (warm cream — brand palette)
 *   Dark  theme_color: #171d18 (handled via media in the <meta> viewport tag)
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Bajgain Farm",
    description: SITE_DESCRIPTION,
    lang: "en",
    start_url: "/",
    scope: "/",
    id: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#faf6ef",
    theme_color: "#faf6ef",
    categories: ["agriculture", "food", "lifestyle"],
    dir: "ltr",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    screenshots: [],
    related_applications: [],
    prefer_related_applications: false,
  };
}
