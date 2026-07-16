import { describe, expect, it } from "vitest";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildLocalBusinessJsonLd,
  buildPageMetadata,
  buildPigProductJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo";
import type { FarmInfo, Pig } from "@/types/entities";

// SITE_URL falls back to http://localhost:3000 when NEXT_PUBLIC_SITE_URL is
// unset, which is the case in the test environment.
const BASE = "http://localhost:3000";

function makeFarmInfo(overrides: Partial<FarmInfo> = {}): FarmInfo {
  return {
    id: "f1",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    farm_name_en: "Bajgain Krishi Farm",
    farm_name_ne: "बजगाईं कृषि फार्म",
    description_en: "A small family pig farm.",
    description_ne: "सानो पारिवारिक सुँगुर फार्म।",
    phone: "+977 9818638437",
    whatsapp: null,
    email: "farm@example.com",
    address_en: "Das Pul Road 12, Arjundhara - 6, Nepal",
    address_ne: "दास पुल रोड १२",
    hours_en: "Sunday - Friday: 8-5",
    hours_ne: "आइतबार - शुक्रबार",
    latitude: 26.664762,
    longitude: 87.98761,
    google_maps_embed_code: null,
    facebook_url: "https://facebook.com/example",
    instagram_url: null,
    youtube_url: null,
    tiktok_url: null,
    established_year: 2019,
    ...overrides,
  };
}

function makePig(overrides: Partial<Pig> = {}): Pig {
  return {
    id: "p1",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-06-01T00:00:00Z",
    name_en: "Young Duroc boar",
    name_ne: "डुरोक भाले",
    listing_type: "breeding",
    breed_en: "Duroc",
    breed_ne: "डुरोक",
    gender: "male",
    date_of_birth: "2025-09-01",
    price: 35000,
    status: "available",
    description_en: "A healthy young boar.",
    description_ne: "स्वस्थ भाले।",
    image_urls: ["/uploads/duroc.jpg"],
    order: 0,
    ...overrides,
  };
}

describe("absoluteUrl", () => {
  it("prefixes site-relative paths with the site origin", () => {
    expect(absoluteUrl("/about")).toBe(`${BASE}/about`);
  });

  it("adds the missing leading slash", () => {
    expect(absoluteUrl("about")).toBe(`${BASE}/about`);
  });

  it("leaves already-absolute URLs untouched", () => {
    expect(absoluteUrl("https://cdn.example.com/a.jpg")).toBe("https://cdn.example.com/a.jpg");
    expect(absoluteUrl("http://localhost:8000/uploads/a.jpg")).toBe(
      "http://localhost:8000/uploads/a.jpg"
    );
  });
});

describe("buildPageMetadata", () => {
  it("sets unique title, description, canonical, OG, and Twitter fields", () => {
    const meta = buildPageMetadata({
      title: "About Our Farm",
      description: "Our story.",
      path: "/about",
    });
    expect(meta.title).toBe("About Our Farm");
    expect(meta.description).toBe("Our story.");
    expect(meta.alternates?.canonical).toBe(`${BASE}/about`);
    expect(meta.openGraph).toMatchObject({
      title: "About Our Farm",
      description: "Our story.",
      url: `${BASE}/about`,
      type: "website",
    });
    expect(meta.twitter).toMatchObject({
      card: "summary_large_image",
      title: "About Our Farm",
    });
  });

  it("bypasses the title template when absoluteTitle is set", () => {
    const meta = buildPageMetadata({
      title: "Site | Tagline",
      description: "d",
      path: "/",
      absoluteTitle: true,
    });
    expect(meta.title).toEqual({ absolute: "Site | Tagline" });
  });

  it("merges page keywords after the site-wide ones", () => {
    const meta = buildPageMetadata({
      title: "t",
      description: "d",
      path: "/piglets",
      keywords: ["piglets for sale"],
    });
    expect(meta.keywords).toEqual([...SITE_KEYWORDS, "piglets for sale"]);
  });

  it("uses the site-wide keywords when no page keywords are given", () => {
    const meta = buildPageMetadata({ title: "t", description: "d", path: "/x" });
    expect(meta.keywords).toEqual(SITE_KEYWORDS);
  });

  it("passes ogImages to both OG and Twitter when given", () => {
    const withImages = buildPageMetadata({
      title: "t",
      description: "d",
      path: "/pigs/p1",
      ogImages: ["http://localhost:8000/uploads/a.jpg"],
    });
    expect(withImages.openGraph).toMatchObject({
      images: ["http://localhost:8000/uploads/a.jpg"],
    });
    expect(withImages.twitter).toMatchObject({
      images: ["http://localhost:8000/uploads/a.jpg"],
    });
  });

  it("falls back to the site-wide OG card when no images are given", () => {
    // Explicit because a page's own openGraph config replaces the root
    // segment's file-based OG image in Next's metadata merge.
    const meta = buildPageMetadata({ title: "t", description: "d", path: "/x" });
    const expected = [expect.objectContaining({ url: "/opengraph-image", width: 1200, height: 630 })];
    expect(meta.openGraph).toMatchObject({ images: expected });
    expect(meta.twitter).toMatchObject({ images: expected });
  });
});

describe("buildLocalBusinessJsonLd", () => {
  it("emits a Farm block with geo, map link, and social profiles", () => {
    const jsonLd = buildLocalBusinessJsonLd(makeFarmInfo());
    expect(jsonLd).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Farm",
      name: "Bajgain Krishi Farm",
      telephone: "+977 9818638437",
      foundingDate: "2019",
      address: { "@type": "PostalAddress", addressCountry: "NP" },
      geo: { latitude: 26.664762, longitude: 87.98761 },
      sameAs: ["https://facebook.com/example"],
    });
    expect(jsonLd.hasMap).toContain("26.664762,87.98761");
  });

  it("omits geo, map, and sameAs entirely when the admin hasn't set them", () => {
    const jsonLd = buildLocalBusinessJsonLd(
      makeFarmInfo({ latitude: null, longitude: null, facebook_url: null })
    );
    expect(jsonLd).not.toHaveProperty("geo");
    expect(jsonLd).not.toHaveProperty("hasMap");
    expect(jsonLd).not.toHaveProperty("sameAs");
  });
});

describe("buildWebSiteJsonLd", () => {
  it("links the website to the farm as publisher", () => {
    expect(buildWebSiteJsonLd()).toEqual({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${BASE}/#website`,
      name: "Bajgain Krishi Farm",
      url: BASE,
      publisher: { "@id": `${BASE}/#farm` },
    });
  });
});

describe("buildBreadcrumbJsonLd", () => {
  it("numbers items root-first with absolute URLs", () => {
    const jsonLd = buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Piglets", path: "/piglets" },
      { name: "Bella", path: "/pigs/p1" },
    ]);
    expect(jsonLd.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "Piglets", item: `${BASE}/piglets` },
      { "@type": "ListItem", position: 3, name: "Bella", item: `${BASE}/pigs/p1` },
    ]);
  });
});

describe("buildPigProductJsonLd", () => {
  it("emits a Product with an NPR offer for a priced, available pig", () => {
    const jsonLd = buildPigProductJsonLd(makePig());
    expect(jsonLd).toMatchObject({
      "@type": "Product",
      name: "Young Duroc boar",
      category: "Livestock",
      offers: {
        "@type": "Offer",
        price: 35000,
        priceCurrency: "NPR",
        availability: "https://schema.org/InStock",
        url: `${BASE}/pigs/p1`,
      },
    });
    // /uploads/ paths resolve to the backend origin.
    expect(jsonLd.image?.[0]).toMatch(/^http:\/\/localhost:800[01]\/uploads\/duroc\.jpg$/);
  });

  it("omits the offer entirely for 'Contact for price' pigs", () => {
    const jsonLd = buildPigProductJsonLd(makePig({ price: null }));
    expect(jsonLd).not.toHaveProperty("offers");
  });

  it("marks sold and reserved pigs as SoldOut", () => {
    expect(buildPigProductJsonLd(makePig({ status: "sold" })).offers?.availability).toBe(
      "https://schema.org/SoldOut"
    );
    expect(buildPigProductJsonLd(makePig({ status: "reserved" })).offers?.availability).toBe(
      "https://schema.org/SoldOut"
    );
  });

  it("falls back to a composed description and omits missing images", () => {
    const jsonLd = buildPigProductJsonLd(makePig({ description_en: "", image_urls: [] }));
    expect(jsonLd.description).toContain("Duroc");
    expect(jsonLd).not.toHaveProperty("image");
  });
});

describe("SITE_DESCRIPTION", () => {
  it("stays within the ~160 character snippet budget", () => {
    expect(SITE_DESCRIPTION.length).toBeLessThanOrEqual(160);
  });
});
