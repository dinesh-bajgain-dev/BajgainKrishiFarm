"use client";

import { AdminSingletonForm } from "@/components/admin/admin-singleton-form";
import { getAdminDictionary } from "@/lib/admin-i18n";
import type { Locale } from "@/lib/i18n";
import { useAdminLocale } from "@/lib/use-admin-locale";
import type { FieldSection } from "@/components/admin/field-config/types";
import type { FarmInfo } from "@/types/entities";

function getSections(locale: Locale): FieldSection<FarmInfo>[] {
  const t = getAdminDictionary(locale).farmInfo;
  return [
    {
      title: t.nameSectionTitle,
      fields: [
        { key: "farm_name_en", label: t.farmNameEnLabel, type: "text" },
        {
          key: "farm_name_ne",
          label: t.farmNameNeLabel,
          type: "text",
          helpText: t.farmNameNeHelp,
        },
        {
          key: "description_en",
          label: t.descEnLabel,
          type: "textarea",
          helpText: t.descEnHelp,
        },
        { key: "description_ne", label: t.descNeLabel, type: "textarea" },
        {
          key: "established_year",
          label: t.establishedYearLabel,
          type: "number",
          helpText: t.establishedYearHelp,
        },
      ],
    },
    {
      title: t.contactSectionTitle,
      fields: [
        { key: "phone", label: t.phoneLabel, type: "text" },
        {
          key: "whatsapp",
          label: t.whatsappLabel,
          type: "text",
          helpText: t.whatsappHelp,
        },
        { key: "email", label: t.emailLabel, type: "text" },
      ],
    },
    {
      title: t.addressSectionTitle,
      fields: [
        { key: "address_en", label: t.addressEnLabel, type: "text" },
        { key: "address_ne", label: t.addressNeLabel, type: "text" },
      ],
    },
    {
      title: t.hoursSectionTitle,
      fields: [
        {
          key: "hours_en",
          label: t.hoursEnLabel,
          type: "textarea",
          helpText: t.hoursEnHelp,
        },
        { key: "hours_ne", label: t.hoursNeLabel, type: "textarea" },
      ],
    },
    {
      title: t.mapSectionTitle,
      description: t.mapSectionDesc,
      fields: [
        {
          key: "google_maps_embed_code",
          label: t.googleMapsEmbedCodeLabel,
          type: "textarea",
          helpText: t.googleMapsEmbedCodeHelp,
        },
      ],
    },
    {
      title: t.socialSectionTitle,
      description: t.socialSectionDesc,
      fields: [
        { key: "facebook_url", label: t.facebookLabel, type: "text" },
        { key: "instagram_url", label: t.instagramLabel, type: "text" },
        { key: "youtube_url", label: t.youtubeLabel, type: "text" },
        { key: "tiktok_url", label: t.tiktokLabel, type: "text" },
      ],
    },
  ];
}

export default function AdminFarmInfoPage() {
  const locale = useAdminLocale();
  const t = getAdminDictionary(locale).farmInfo;
  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">{t.title}</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">{t.subtitle}</p>
      <AdminSingletonForm<FarmInfo>
        apiPath="/api/farm-info/"
        sections={getSections(locale)}
      />
    </div>
  );
}
