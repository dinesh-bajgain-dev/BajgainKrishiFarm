import type { MetadataRoute } from "next";
import { apiFetchOrNull } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";
import type { Pig } from "@/types/entities";

const STATIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
}[] = [
  { path: "", priority: 1.0, changeFrequency: "daily" },
  { path: "/piglets", priority: 0.9, changeFrequency: "daily" },
  { path: "/breeding-pigs", priority: 0.9, changeFrequency: "daily" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/gallery", priority: 0.7, changeFrequency: "weekly" },
  { path: "/location", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL.replace(/\/$/, "");

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Only index available pig pages. Sold/reserved pigs have no SEO value and,
  // if a record is later deleted, the stale URL triggers a GSC "Page with
  // redirect" warning. If the API is down the sitemap still serves the static
  // routes rather than erroring.
  const pigs = (await apiFetchOrNull<Pig[]>("/api/pigs/")) ?? [];
  const pigEntries: MetadataRoute.Sitemap = pigs
    .filter((pig) => pig.status === "available")
    .map((pig) => ({
      url: `${baseUrl}/pigs/${pig.id}`,
      lastModified: pig.updated_at ? new Date(pig.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  return [...staticEntries, ...pigEntries];
}
