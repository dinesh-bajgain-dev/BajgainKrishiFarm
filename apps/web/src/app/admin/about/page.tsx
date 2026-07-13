"use client";

import { AdminSingletonForm } from "@/components/admin/admin-singleton-form";
import { getAdminDictionary } from "@/lib/admin-i18n";
import type { Locale } from "@/lib/i18n";
import { useAdminLocale } from "@/lib/use-admin-locale";
import type { FieldSection } from "@/components/admin/field-config/types";
import type { AboutPage } from "@/types/entities";

function getSections(locale: Locale): FieldSection<AboutPage>[] {
  const t = getAdminDictionary(locale).about;
  return [
    {
      title: t.storySectionTitle,
      description: t.storySectionDesc,
      fields: [
        { key: "story_en", label: t.storyEnLabel, type: "textarea" },
        { key: "story_ne", label: t.storyNeLabel, type: "textarea", helpText: t.storyNeHelp },
        { key: "farm_photo_url", label: t.farmPhotoLabel, type: "image", helpText: t.farmPhotoHelp },
      ],
    },
    {
      title: t.practicesSectionTitle,
      description: t.practicesSectionDesc,
      fields: [
        { key: "practices_en", label: t.practicesEnLabel, type: "textarea" },
        { key: "practices_ne", label: t.practicesNeLabel, type: "textarea" },
      ],
    },
    {
      title: t.ownerSectionTitle,
      description: t.ownerSectionDesc,
      fields: [
        { key: "owner_name", label: t.ownerNameLabel, type: "text" },
        { key: "owner_message_en", label: t.ownerMessageEnLabel, type: "textarea" },
        { key: "owner_message_ne", label: t.ownerMessageNeLabel, type: "textarea" },
        { key: "owner_photo_url", label: t.ownerPhotoLabel, type: "image" },
      ],
    },
  ];
}

export default function AdminAboutPage() {
  const locale = useAdminLocale();
  const t = getAdminDictionary(locale).about;
  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">{t.title}</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">{t.subtitle}</p>
      <AdminSingletonForm<AboutPage> apiPath="/api/about-page/" sections={getSections(locale)} />
    </div>
  );
}
