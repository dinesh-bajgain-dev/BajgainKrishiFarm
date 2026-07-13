"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import type { FieldSection } from "@/components/admin/field-config/types";

/**
 * One-page settings form for singleton content (Farm Info, Homepage, About).
 * Loads the current values with GET and saves everything with a single PUT.
 */
export function AdminSingletonForm<T>({
  apiPath,
  sections,
}: {
  apiPath: string;
  sections: FieldSection<T>[];
}) {
  const locale = useAdminLocale();
  const t = getAdminDictionary(locale);
  const [loading, setLoading] = useState(true);
  const form = useForm<Record<string, unknown>>();

  useEffect(() => {
    adminApiFetch<Record<string, unknown>>(apiPath)
      .then((data) => form.reset(data))
      .catch(() => toast.error(t.singletonForm.loadFailedToast))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiPath]);

  async function onSubmit(values: Record<string, unknown>) {
    try {
      await adminApiFetch(apiPath, {
        method: "PUT",
        body: JSON.stringify(values),
      });
      toast.success(t.singletonForm.savedToast);
    } catch {
      toast.error(t.singletonForm.saveFailedToast);
    }
  }

  if (loading) return <p className="text-muted-foreground">{t.common.loading}</p>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl space-y-8" noValidate>
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-2xl border border-border bg-card p-5 sm:p-6"
          >
            <h2 className="font-heading text-lg font-semibold">{section.title}</h2>
            {section.description && (
              <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
            )}
            <div className="mt-5 space-y-5">
              {section.fields.map((field) => (
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
            </div>
          </section>
        ))}

        <div className="sticky bottom-4">
          <Button
            type="submit"
            size="lg"
            className="w-full shadow-lg sm:w-auto"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? t.common.saving : t.common.saveChanges}
          </Button>
        </div>
      </form>
    </Form>
  );
}
