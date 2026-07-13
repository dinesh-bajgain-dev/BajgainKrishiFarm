import { z } from "zod";
import type { EntityConfig } from "@/components/admin/field-config/types";
import { getAdminDictionary } from "@/lib/admin-i18n";
import type { Locale } from "@/lib/i18n";
import type { Pig } from "@/types/entities";

export const pigSchema = z.object({
  name_en: z.string().min(1, "Please give this pig a name"),
  name_ne: z.string().default(""),
  listing_type: z.string().min(1, "Required"),
  breed_en: z.string().min(1, "Please enter the breed"),
  breed_ne: z.string().default(""),
  gender: z.string().min(1, "Required"),
  date_of_birth: z
    .string()
    .nullable()
    .optional()
    .transform((v) => (v ? v : null)),
  price: z.number().nullable().optional(),
  status: z.string().min(1, "Required"),
  description_en: z.string().default(""),
  description_ne: z.string().default(""),
  image_urls: z.array(z.string()).default([]),
  order: z.number().default(0),
});

export function getPigsConfig(locale: Locale): EntityConfig<Pig> {
  const t = getAdminDictionary(locale).pigsConfig;
  return {
    name: t.entityName,
    pluralName: t.entityPluralName,
    apiPath: "/api/pigs/",
    adminPath: "/admin/pigs",
    columns: ["name_en", "listing_type", "status"],
    fields: [
      { key: "name_en", label: t.nameEnLabel, type: "text", helpText: t.nameEnHelp },
      { key: "name_ne", label: t.nameNeLabel, type: "text", helpText: t.nameNeHelp },
      {
        key: "listing_type",
        label: t.listingTypeLabel,
        type: "select",
        options: [
          { value: "piglet", label: t.listingTypePiglet },
          { value: "breeding", label: t.listingTypeBreeding },
        ],
      },
      { key: "breed_en", label: t.breedEnLabel, type: "text", helpText: t.breedEnHelp },
      { key: "breed_ne", label: t.breedNeLabel, type: "text", helpText: t.breedNeHelp },
      {
        key: "gender",
        label: t.genderLabel,
        type: "select",
        options: [
          { value: "male", label: t.genderMale },
          { value: "female", label: t.genderFemale },
        ],
      },
      { key: "date_of_birth", label: t.dobLabel, type: "date", helpText: t.dobHelp },
      { key: "price", label: t.priceLabel, type: "number", helpText: t.priceHelp },
      {
        key: "status",
        label: t.statusLabel,
        type: "select",
        options: [
          { value: "available", label: t.statusAvailable },
          { value: "reserved", label: t.statusReserved },
          { value: "sold", label: t.statusSold },
        ],
      },
      { key: "description_en", label: t.descEnLabel, type: "textarea" },
      { key: "description_ne", label: t.descNeLabel, type: "textarea", helpText: t.descNeHelp },
      { key: "image_urls", label: t.photosLabel, type: "images" },
    ],
    schema: pigSchema,
    getTitle: (item) => item.name_en,
    defaultValues: {
      name_en: "",
      name_ne: "",
      listing_type: "piglet",
      breed_en: "",
      breed_ne: "",
      gender: "male",
      date_of_birth: null,
      price: null,
      status: "available",
      description_en: "",
      description_ne: "",
      image_urls: [],
      order: 0,
    },
  };
}
