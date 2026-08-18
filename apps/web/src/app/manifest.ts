import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION } from "@/lib/seo";
import { SITE_NAME } from "@/lib/constants";

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
