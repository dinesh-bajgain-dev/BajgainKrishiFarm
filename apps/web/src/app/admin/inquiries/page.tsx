"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { adminApiFetch } from "@/lib/api";
import { getAdminDictionary } from "@/lib/admin-i18n";
import { useAdminLocale } from "@/lib/use-admin-locale";
import { cn } from "@/lib/utils";
import type { Inquiry, InquiryStatus } from "@/types/entities";

const STATUS_VARIANT: Record<InquiryStatus, "default" | "secondary" | "outline"> = {
  new: "default",
  contacted: "secondary",
  closed: "outline",
};

export default function AdminInquiriesPage() {
  const locale = useAdminLocale();
  const t = getAdminDictionary(locale).inquiriesList;
  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);

  const statusLabels: Record<InquiryStatus, string> = {
    new: t.statusNew,
    contacted: t.statusContacted,
    closed: t.statusClosed,
  };

  useEffect(() => {
    adminApiFetch<Inquiry[]>("/api/inquiries/")
      .then(setInquiries)
      .catch(() => {
        toast.error(t.loadFailedToast);
        setInquiries([]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">{t.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>

      <div className="mt-6 space-y-3">
        {inquiries === null &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}

        {inquiries !== null && inquiries.length === 0 && (
          <p className="py-10 text-center text-muted-foreground">{t.emptyState}</p>
        )}

        {inquiries?.map((inquiry) => (
          <Link
            key={inquiry.id}
            href={`/admin/inquiries/${inquiry.id}`}
            className={cn(
              "card-lift block rounded-2xl border bg-card p-5 shadow-sm",
              inquiry.status === "new" ? "border-primary/40 bg-primary/5" : "border-border"
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-heading font-semibold">{inquiry.name}</p>
                <p className="text-sm text-muted-foreground">
                  {inquiry.email} · {inquiry.phone}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <Badge variant={STATUS_VARIANT[inquiry.status]}>{statusLabels[inquiry.status]}</Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(inquiry.created_at).toLocaleDateString(locale === "ne" ? "ne-NP" : "en-US")}
                </span>
              </div>
            </div>

            {inquiry.interest && (
              <p className="mt-2 text-xs font-medium text-primary">
                {t.colAskingAbout}: {inquiry.interest}
              </p>
            )}

            <p className="mt-3 line-clamp-2 text-sm text-foreground/80">{inquiry.message}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
