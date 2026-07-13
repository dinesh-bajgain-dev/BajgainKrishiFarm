"use client";

import type { ControllerRenderProps } from "react-hook-form";
import { GoogleMapEmbed } from "@/components/shared/google-map-embed";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { MultiImageUploadField } from "@/components/admin/multi-image-upload-field";
import { VideoUploadField } from "@/components/admin/video-upload-field";
import { getAdminDictionary } from "@/lib/admin-i18n";
import { useAdminLocale } from "@/lib/use-admin-locale";
import type { FieldConfig } from "@/components/admin/field-config/types";

/** Renders the right input for a field-config entry; shared by all admin forms. */
export function AdminFieldControl<T>({
  field,
  rhfField,
}: {
  field: FieldConfig<T>;
  rhfField: ControllerRenderProps<Record<string, unknown>, never>;
}) {
  const locale = useAdminLocale();
  const t = getAdminDictionary(locale).common;

  switch (field.type) {
    case "text":
      return <Input {...rhfField} value={(rhfField.value as string) ?? ""} />;
    case "textarea":
      if (field.key === "google_maps_embed_code") {
        const embedValue = (rhfField.value as string | null) ?? "";
        return (
          <div className="space-y-4">
            <Textarea
              rows={6}
              {...rhfField}
              value={embedValue}
              placeholder="Paste the Google Maps iframe embed code here"
            />
            <GoogleMapEmbed
              embedCode={embedValue}
              label={field.label}
              className="aspect-[16/9] w-full overflow-hidden rounded-2xl"
            />
          </div>
        );
      }

      return (
        <Textarea
          rows={4}
          {...rhfField}
          value={(rhfField.value as string) ?? ""}
        />
      );
    case "number":
      return (
        <Input
          type="number"
          step="any"
          {...rhfField}
          value={(rhfField.value as number) ?? ""}
          onChange={(e) =>
            rhfField.onChange(
              Number.isNaN(e.target.valueAsNumber)
                ? null
                : e.target.valueAsNumber,
            )
          }
        />
      );
    case "date":
      return (
        <Input
          type="date"
          {...rhfField}
          value={(rhfField.value as string) ?? ""}
          onChange={(e) => rhfField.onChange(e.target.value || null)}
        />
      );
    case "boolean":
      return (
        <Select
          value={rhfField.value ? "true" : "false"}
          onValueChange={(v) => rhfField.onChange(v === "true")}
          items={{ true: t.yes, false: t.no }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">{t.yes}</SelectItem>
            <SelectItem value="false">{t.no}</SelectItem>
          </SelectContent>
        </Select>
      );
    case "select":
      return (
        <Select
          value={(rhfField.value as string) ?? ""}
          onValueChange={rhfField.onChange}
          items={Object.fromEntries(
            field.options.map((opt) => [opt.value, opt.label]),
          )}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t.selectPlaceholder(field.label)} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "image":
      return (
        <ImageUploadField
          value={rhfField.value as string | null}
          onChange={rhfField.onChange}
        />
      );
    case "images":
      return (
        <MultiImageUploadField
          value={rhfField.value as string[] | null}
          onChange={rhfField.onChange}
        />
      );
    case "video":
      return (
        <VideoUploadField
          value={rhfField.value as string | null}
          onChange={rhfField.onChange}
        />
      );
  }
}
