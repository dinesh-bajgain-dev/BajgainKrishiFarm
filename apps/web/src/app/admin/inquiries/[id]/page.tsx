"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminApiFetch } from "@/lib/api";
import { getAdminDictionary } from "@/lib/admin-i18n";
import { useAdminLocale } from "@/lib/use-admin-locale";
import type { Inquiry, InquiryStatus, PreferredContactMethod } from "@/types/entities";

export default function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const locale = useAdminLocale();
  const dict = getAdminDictionary(locale);
  const t = dict.inquiryDetail;
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [saving, setSaving] = useState(false);

  const contactMethodLabels: Record<PreferredContactMethod, string> = {
    phone: t.contactPhone,
    email: t.contactEmail,
    whatsapp: t.contactWhatsapp,
  };

  useEffect(() => {
    adminApiFetch<Inquiry>(`/api/inquiries/${id}`)
      .then(setInquiry)
      .catch(() => {
        toast.error(t.loadFailedToast);
        router.push("/admin/inquiries");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function updateStatus(status: InquiryStatus) {
    setSaving(true);
    try {
      const updated = await adminApiFetch<Inquiry>(`/api/inquiries/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setInquiry(updated);
      toast.success(t.statusUpdatedToast);
    } catch {
      toast.error(t.statusUpdateFailedToast);
    } finally {
      setSaving(false);
    }
  }

  if (!inquiry) return <p className="text-muted-foreground">{dict.common.loading}</p>;

  return (
    <div className="max-w-2xl">
      <LinkButton href="/admin/inquiries" variant="ghost" size="sm" className="mb-4 -ml-2">
        <ArrowLeft className="size-4" /> {t.back}
      </LinkButton>

      <h1 className="font-heading text-2xl font-semibold">{inquiry.name}</h1>
      <p className="text-sm text-muted-foreground">
        {t.submitted(new Date(inquiry.created_at).toLocaleString(locale === "ne" ? "ne-NP" : "en-US"))}
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-5">
        <div>
          <dt className="text-xs uppercase text-muted-foreground">{t.email}</dt>
          <dd>{inquiry.email}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-muted-foreground">{t.phone}</dt>
          <dd>{inquiry.phone}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-muted-foreground">{t.preferredContact}</dt>
          <dd>{contactMethodLabels[inquiry.preferred_contact_method]}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-muted-foreground">{t.quantity}</dt>
          <dd>{inquiry.quantity ?? "—"}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs uppercase text-muted-foreground">{t.askingAbout}</dt>
          <dd>{inquiry.interest ?? "—"}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs uppercase text-muted-foreground">{t.message}</dt>
          <dd className="whitespace-pre-wrap">{inquiry.message}</dd>
        </div>
      </dl>

      <div className="mt-6 flex items-center gap-3">
        <span className="text-sm font-medium">{t.status}</span>
        <Select
          value={inquiry.status}
          onValueChange={(v) => updateStatus(v as InquiryStatus)}
          disabled={saving}
          items={{ new: t.statusNew, contacted: t.statusContacted, closed: t.statusClosed }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">{t.statusNew}</SelectItem>
            <SelectItem value="contacted">{t.statusContacted}</SelectItem>
            <SelectItem value="closed">{t.statusClosed}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" className="mt-8" onClick={() => router.push("/admin/inquiries")}>
        {t.done}
      </Button>
    </div>
  );
}
