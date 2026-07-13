"use client";

import { AdminSingletonForm } from "@/components/admin/admin-singleton-form";
import { getAdminDictionary } from "@/lib/admin-i18n";
import type { Locale } from "@/lib/i18n";
import { useAdminLocale } from "@/lib/use-admin-locale";
import type { FieldSection } from "@/components/admin/field-config/types";
import type { PageBanners } from "@/types/entities";

function getSections(locale: Locale): FieldSection<PageBanners>[] {
  const t = getAdminDictionary(locale).pageBanners;
  return [
    {
      title: t.sectionTitle,
      fields: [
        { key: "about_banner_url", label: t.aboutLabel, type: "image" },
        { key: "piglets_banner_url", label: t.pigletsLabel, type: "image" },
        { key: "breeding_banner_url", label: t.breedingLabel, type: "image" },
        { key: "gallery_banner_url", label: t.galleryLabel, type: "image" },
        { key: "location_banner_url", label: t.locationLabel, type: "image" },
        { key: "contact_banner_url", label: t.contactLabel, type: "image" },
      ],
    },
  ];
}

export default function AdminPageBannersPage() {
  const locale = useAdminLocale();
  const t = getAdminDictionary(locale).pageBanners;
  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">{t.title}</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">{t.subtitle}</p>
      <AdminSingletonForm<PageBanners>
        apiPath="/api/page-banners/"
        sections={getSections(locale)}
      />
    </div>
  );
}
