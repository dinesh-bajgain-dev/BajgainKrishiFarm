"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiPost } from "@/lib/api";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { Inquiry, InquiryCreate } from "@/types/entities";

export function InquiryForm({
  locale,
  defaultPigId,
  defaultPigName,
}: {
  locale: Locale;
  defaultPigId?: string;
  defaultPigName?: string;
}) {
  const dict = getDictionary(locale);

  const inquirySchema = z.object({
    name: z.string().min(2, dict.contact.errorName),
    phone: z.string().min(6, dict.contact.errorPhone),
    email: z.string().email(dict.contact.errorEmail),
    quantity: z.string().optional(),
    preferred_contact_method: z.enum(["phone", "email", "whatsapp"]),
    message: z.string().min(10, dict.contact.errorMessage),
  });

  type InquiryFormValues = z.infer<typeof inquirySchema>;

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      quantity: "",
      preferred_contact_method: "phone",
      message: defaultPigName ? `${dict.contact.interestedIn}: ${defaultPigName}` : "",
    },
  });

  async function onSubmit(values: InquiryFormValues) {
    try {
      const payload: InquiryCreate = {
        ...values,
        pig_id: defaultPigId ?? null,
        interest: defaultPigName ?? null,
      };
      await apiPost<Inquiry>("/api/inquiries/", payload);
      toast.success(dict.contact.success);
      form.reset();
    } catch {
      toast.error(dict.contact.error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {defaultPigName && (
          <div className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm">
            {dict.contact.interestedIn}: <span className="font-medium">{defaultPigName}</span>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.contact.name}</FormLabel>
                <FormControl>
                  <Input placeholder={dict.contact.namePlaceholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.contact.phone}</FormLabel>
                <FormControl>
                  <Input placeholder="+977 98XXXXXXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dict.contact.email}</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.contact.quantity}</FormLabel>
                <FormControl>
                  <Input placeholder={dict.contact.quantityPlaceholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preferred_contact_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.contact.contactMethod}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  items={{
                    phone: dict.common.phone,
                    email: dict.common.email,
                    whatsapp: dict.common.whatsapp,
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="phone">{dict.common.phone}</SelectItem>
                    <SelectItem value="email">{dict.common.email}</SelectItem>
                    <SelectItem value="whatsapp">{dict.common.whatsapp}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dict.contact.message}</FormLabel>
              <FormControl>
                <Textarea rows={5} placeholder={dict.contact.messagePlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" disabled={form.formState.isSubmitting} className="w-full sm:w-auto">
          {form.formState.isSubmitting ? dict.contact.sending : dict.contact.send}
        </Button>
      </form>
    </Form>
  );
}
