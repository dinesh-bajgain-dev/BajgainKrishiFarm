"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AdminFieldControl } from "@/components/admin/admin-field-control";
import { adminApiFetch } from "@/lib/api";
import { getAdminDictionary } from "@/lib/admin-i18n";
import { useAdminLocale } from "@/lib/use-admin-locale";
import type { EntityConfig } from "@/components/admin/field-config/types";

export function AdminEntityForm<T extends { id: string }>({
  config,
  mode,
  id,
}: {
  config: EntityConfig<T>;
  mode: "create" | "edit";
  id?: string;
}) {
  const router = useRouter();
  const locale = useAdminLocale();
  const t = getAdminDictionary(locale);
  const [loading, setLoading] = useState(mode === "edit");

  // Loosely typed on purpose: react-hook-form's generic inference doesn't play
  // well with a generic T driven by a runtime field-config; values are shaped
  // correctly by the config's zod schema at submit time instead.
  const form = useForm<Record<string, unknown>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(config.schema as any) as unknown as Resolver<Record<string, unknown>>,
    defaultValues: config.defaultValues as Record<string, unknown>,
  });

  useEffect(() => {
    if (mode === "edit" && id) {
      adminApiFetch<T>(`${config.apiPath}${id}`)
        .then((item) => form.reset(item as Record<string, unknown>))
        .catch(() => toast.error(t.entityForm.loadFailedToast(config.name)))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, id]);

  async function onSubmit(values: Record<string, unknown>) {
    try {
      if (mode === "create") {
        await adminApiFetch(config.apiPath, {
          method: "POST",
          body: JSON.stringify(values),
        });
        toast.success(t.entityForm.createdToast(config.name));
      } else {
        await adminApiFetch(`${config.apiPath}${id}`, {
          method: "PUT",
          body: JSON.stringify(values),
        });
        toast.success(t.entityForm.updatedToast(config.name));
      }
      router.push(config.adminPath);
      router.refresh();
    } catch {
      toast.error(t.entityForm.saveFailedToast(config.name));
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">{t.common.loading}</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl space-y-5" noValidate>
        {config.fields.map((field) => (
          <FormField
            key={field.key}
            control={form.control}
            name={field.key as never}
            render={({ field: rhfField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <AdminFieldControl field={field} rhfField={rhfField} />
                </FormControl>
                {field.helpText && <FormDescription>{field.helpText}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="flex gap-3 pt-2">
          <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? t.common.saving
              : mode === "create"
                ? t.common.save
                : t.common.saveChanges}
          </Button>
          <Button type="button" size="lg" variant="outline" onClick={() => router.push(config.adminPath)}>
            {t.common.cancel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
