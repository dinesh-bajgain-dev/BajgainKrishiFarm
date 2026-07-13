"use client";

import { AdminSingletonForm } from "@/components/admin/admin-singleton-form";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { getHighlightsConfig } from "@/components/admin/field-config/highlights.config";
import { Separator } from "@/components/ui/separator";
import { getAdminDictionary } from "@/lib/admin-i18n";
import type { Locale } from "@/lib/i18n";
import { useAdminLocale } from "@/lib/use-admin-locale";
import type { FieldSection } from "@/components/admin/field-config/types";
import type { Highlight, HomePage } from "@/types/entities";

function getHeroSections(locale: Locale): FieldSection<HomePage>[] {
  const t = getAdminDictionary(locale).homepage;
  return [
    {
      title: t.heroSectionTitle,
      description: t.heroSectionDesc,
      fields: [
        { key: "hero_title_en", label: t.heroTitleEnLabel, type: "text" },
        {
          key: "hero_title_ne",
          label: t.heroTitleNeLabel,
          type: "text",
          helpText: t.heroTitleNeHelp,
        },
        { key: "hero_subtitle_en", label: t.heroSubtitleEnLabel, type: "textarea" },
        { key: "hero_subtitle_ne", label: t.heroSubtitleNeLabel, type: "textarea" },
        {
          key: "hero_image_url",
          label: t.heroImageLabel,
          type: "image",
          helpText: t.heroImageHelp,
        },
        {
          key: "hero_video_url",
          label: t.heroVideoLabel,
          type: "video",
          helpText: t.heroVideoHelp,
        },
      ],
    },
  ];
}

export default function AdminHomepagePage() {
  const locale = useAdminLocale();
  const t = getAdminDictionary(locale).homepage;

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">{t.title}</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">{t.subtitle}</p>

      <AdminSingletonForm<HomePage> apiPath="/api/home-page/" sections={getHeroSections(locale)} />

      <Separator className="my-10" />

      <div className="mb-2">
        <p className="text-sm text-muted-foreground">{t.cardsNote}</p>
      </div>
      <AdminDataTable<Highlight> config={getHighlightsConfig(locale)} />
    </div>
  );
}
