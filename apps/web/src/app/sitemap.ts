import type { MetadataRoute } from "next";
import { apiFetchOrNull } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";
import type { Pig } from "@/types/entities";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/piglets", priority: 0.9, changeFrequency: "weekly" },
  { path: "/breeding-pigs", priority: 0.9, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/gallery", priority: 0.6, changeFrequency: "weekly" },
  { path: "/location", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Pig detail pages, with real modification dates. If the API is down the
  // sitemap still serves the static routes rather than erroring.
  const pigs = (await apiFetchOrNull<Pig[]>("/api/pigs/")) ?? [];
  const pigEntries: MetadataRoute.Sitemap = pigs.map((pig) => ({
    url: `${SITE_URL}/pigs/${pig.id}`,
    lastModified: new Date(pig.updated_at),
    changeFrequency: "weekly",
    priority: pig.status === "available" ? 0.8 : 0.4,
  }));

  return [...staticEntries, ...pigEntries];
}
