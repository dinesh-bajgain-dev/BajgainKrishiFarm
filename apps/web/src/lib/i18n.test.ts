import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { formatAge, formatPrice, loc, toDevanagariDigits } from "@/lib/i18n";

describe("loc", () => {
  it("falls back to the English field when the Nepali value is empty", () => {
    const pig = { name_en: "Bella", name_ne: "" };
    expect(loc(pig, "name", "ne")).toBe("Bella");
  });

  it("returns the Nepali field when present", () => {
    const pig = { name_en: "Bella", name_ne: "बेला" };
    expect(loc(pig, "name", "ne")).toBe("बेला");
  });

  it("returns empty string when the object is null", () => {
    expect(loc(null, "name", "en")).toBe("");
  });
});

describe("formatPrice", () => {
  it("shows a contact prompt in the requested locale when price is null", () => {
    expect(formatPrice(null, "en")).toBe("Contact for price");
    expect(formatPrice(null, "ne")).toBe("मूल्यका लागि सम्पर्क गर्नुहोस्");
  });

  it("formats a price with locale-appropriate currency prefix and digits", () => {
    expect(formatPrice(15000, "en")).toBe("Rs 15,000");
    expect(formatPrice(15000, "ne")).toBe("रु १५,०००");
  });
});

describe("toDevanagariDigits", () => {
  it("converts every ASCII digit to its Devanagari equivalent", () => {
    expect(toDevanagariDigits("1234567890")).toBe("१२३४५६७८९०");
  });
});

describe("formatAge", () => {
  const NOW = new Date("2026-07-13T00:00:00.000Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns null when no date of birth is given", () => {
    expect(formatAge(null, "en")).toBeNull();
    expect(formatAge(undefined, "en")).toBeNull();
  });

  it("returns null for an invalid date string", () => {
    expect(formatAge("not-a-date", "en")).toBeNull();
  });

  it("reports age in weeks for piglets under 3 months old", () => {
    const fiveWeeksAgo = new Date(NOW.getTime() - 5 * 7 * 86_400_000).toISOString();
    expect(formatAge(fiveWeeksAgo, "en")).toBe("5 weeks old");
    expect(formatAge(fiveWeeksAgo, "ne")).toBe("५ हप्ताको");
  });

  it("reports age in years and months for pigs over a year old", () => {
    // 740 days lands cleanly on "2 years old" with no remainder month
    // (floor(740/365.25)=2, floor((740-730.5)/30.44)=0) — the function floors
    // days first, so a fractional-year formula like `2 * 365.25` days can
    // truncate to 1 year 11 mo depending on rounding, hence the fixed value.
    const twoYearsAgo = new Date(NOW.getTime() - 740 * 86_400_000).toISOString();
    expect(formatAge(twoYearsAgo, "en")).toBe("2 years old");
    expect(formatAge(twoYearsAgo, "ne")).toBe("२ वर्षको");
  });
});
