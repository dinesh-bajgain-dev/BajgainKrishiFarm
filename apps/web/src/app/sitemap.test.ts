import { afterEach, describe, expect, it, vi } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import * as api from "@/lib/api";
import type { Pig } from "@/types/entities";

const BASE = "http://localhost:3000";

const PIG = {
  id: "p1",
  updated_at: "2026-06-01T00:00:00Z",
  status: "available",
} as Pig;

afterEach(() => {
  vi.restoreAllMocks();
});

describe("sitemap", () => {
  it("lists every public route plus a detail URL per pig", async () => {
    vi.spyOn(api, "apiFetchOrNull").mockResolvedValue([
      PIG,
      { ...PIG, id: "p2", status: "sold" },
    ]);

    const entries = await sitemap();
    const urls = entries.map((e) => e.url);

    for (const path of ["", "/about", "/piglets", "/breeding-pigs", "/gallery", "/location", "/contact"]) {
      expect(urls).toContain(`${BASE}${path}`);
    }
    expect(urls).toContain(`${BASE}/pigs/p1`);
    expect(urls).toContain(`${BASE}/pigs/p2`);
  });

  it("uses the pig's real updated_at as lastModified and ranks available pigs higher", async () => {
    vi.spyOn(api, "apiFetchOrNull").mockResolvedValue([
      PIG,
      { ...PIG, id: "p2", status: "sold" },
    ]);

    const entries = await sitemap();
    const available = entries.find((e) => e.url.endsWith("/pigs/p1"));
    const sold = entries.find((e) => e.url.endsWith("/pigs/p2"));

    expect(available?.lastModified).toEqual(new Date("2026-06-01T00:00:00Z"));
    expect(available?.priority).toBeGreaterThan(sold!.priority!);
  });

  it("still serves the static routes when the API is down", async () => {
    vi.spyOn(api, "apiFetchOrNull").mockResolvedValue(null);

    const entries = await sitemap();
    expect(entries).toHaveLength(7);
    expect(entries[0].url).toBe(BASE);
  });
});

describe("robots", () => {
  it("allows the site, blocks the admin panel, and points at the sitemap", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/", disallow: "/admin" },
      sitemap: `${BASE}/sitemap.xml`,
    });
  });
});
