"use client";

import { use } from "react";
import { AdminEntityForm } from "@/components/admin/admin-entity-form";
import { getPigsConfig } from "@/components/admin/field-config/pigs.config";
import { getAdminDictionary } from "@/lib/admin-i18n";
import { useAdminLocale } from "@/lib/use-admin-locale";
import type { Pig } from "@/types/entities";

export default function EditPigPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const locale = useAdminLocale();
  const t = getAdminDictionary(locale).pigEdit;
  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">{t.title}</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">{t.subtitle}</p>
      <AdminEntityForm<Pig> config={getPigsConfig(locale)} mode="edit" id={id} />
    </div>
  );
}
