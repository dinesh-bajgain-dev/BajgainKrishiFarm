import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { FALLBACK_IMAGE_URL } from "@/lib/api";

// Regression: ISSUE-001 — FALLBACK_IMAGE_URL pointed at a static asset that
// didn't exist (apps/web/public/ was missing entirely), so EntityImage's
// error fallback rendered a second broken image instead of a graceful
// placeholder. Every pig/gallery photo without a real upload hit this path.
// Found by /qa on 2026-07-13
// Report: .gstack/qa-reports/qa-report-localhost-2026-07-13.md
describe("FALLBACK_IMAGE_URL asset", () => {
  it("resolves to a static file that actually exists in public/", () => {
    const publicPath = path.join(__dirname, "../../public", FALLBACK_IMAGE_URL);
    expect(existsSync(publicPath)).toBe(true);
  });

  it("is a well-formed, non-empty SVG", () => {
    const publicPath = path.join(__dirname, "../../public", FALLBACK_IMAGE_URL);
    const content = readFileSync(publicPath, "utf-8");
    expect(content).toContain("<svg");
    expect(content.length).toBeGreaterThan(0);
  });
});
