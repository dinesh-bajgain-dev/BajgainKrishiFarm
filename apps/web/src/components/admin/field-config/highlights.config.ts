import { z } from "zod";
import type { EntityConfig } from "@/components/admin/field-config/types";
import { HIGHLIGHT_ICON_OPTIONS } from "@/components/shared/highlight-icons";
import { getAdminDictionary } from "@/lib/admin-i18n";
import type { Locale } from "@/lib/i18n";
import type { Highlight } from "@/types/entities";

export const highlightSchema = z.object({
  icon: z.string().min(1, "Required"),
  title_en: z.string().min(1, "Required"),
  title_ne: z.string().default(""),
  description_en: z.string().min(1, "Required"),
  description_ne: z.string().default(""),
  order: z.number().default(0),
});

export function getHighlightsConfig(locale: Locale): EntityConfig<Highlight> {
  const t = getAdminDictionary(locale).highlightsConfig;
  return {
    name: t.entityName,
    pluralName: t.entityPluralName,
    apiPath: "/api/highlights/",
    adminPath: "/admin/homepage",
    columns: ["title_en", "icon"],
    fields: [
      { key: "icon", label: t.iconLabel, type: "select", options: HIGHLIGHT_ICON_OPTIONS },
      { key: "title_en", label: t.titleEnLabel, type: "text" },
      { key: "title_ne", label: t.titleNeLabel, type: "text", helpText: t.titleNeHelp },
      { key: "description_en", label: t.descEnLabel, type: "textarea" },
      { key: "description_ne", label: t.descNeLabel, type: "textarea" },
      { key: "order", label: t.orderLabel, type: "number", helpText: t.orderHelp },
    ],
    schema: highlightSchema,
    getTitle: (item) => item.title_en,
    defaultValues: {
      icon: "piggy-bank",
      title_en: "",
      title_ne: "",
      description_en: "",
      description_ne: "",
      order: 0,
    },
  };
}
