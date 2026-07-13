"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Camera, Images, MailQuestion, PiggyBank, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LinkButton } from "@/components/ui/link-button";
import { adminApiFetch } from "@/lib/api";
import { getAdminDictionary } from "@/lib/admin-i18n";
import { useAdminLocale } from "@/lib/use-admin-locale";
import type { DashboardSummary } from "@/types/entities";

export default function AdminDashboardPage() {
  const locale = useAdminLocale();
  const t = getAdminDictionary(locale).dashboard;
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    adminApiFetch<DashboardSummary>("/api/admin/summary").then(setSummary).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">{t.welcome}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <LinkButton size="lg" href="/admin/pigs/new">
          <Plus className="size-5" /> {t.addPig}
        </LinkButton>
        <LinkButton size="lg" variant="outline" href="/admin/gallery">
          <Camera className="size-5" /> {t.uploadPhotos}
        </LinkButton>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/inquiries">
          <Card className="card-lift border-primary/40 bg-primary/5">
            <CardContent className="flex items-center gap-4">
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <MailQuestion className="size-6" />
              </span>
              <div>
                {summary ? (
                  <p className="font-heading text-2xl font-semibold">
                    {t.newOfTotal(summary.new_inquiries, summary.inquiries)}
                  </p>
                ) : (
                  <Skeleton className="h-8 w-24" />
                )}
                <p className="text-sm text-muted-foreground">{t.messagesFromVisitors}</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/pigs">
          <Card className="card-lift">
            <CardContent className="flex items-center gap-4">
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <PiggyBank className="size-6" />
              </span>
              <div>
                {summary ? (
                  <p className="font-heading text-2xl font-semibold">
                    {t.ofForSale(
                      summary.available_piglets + summary.available_breeding_pigs,
                      summary.pigs
                    )}
                  </p>
                ) : (
                  <Skeleton className="h-8 w-20" />
                )}
                <p className="text-sm text-muted-foreground">
                  {summary
                    ? t.pigletsBreedingCount(summary.available_piglets, summary.available_breeding_pigs)
                    : t.pigsListed}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/gallery">
          <Card className="card-lift">
            <CardContent className="flex items-center gap-4">
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Images className="size-6" />
              </span>
              <div>
                {summary ? (
                  <p className="font-heading text-2xl font-semibold">{summary.gallery_images}</p>
                ) : (
                  <Skeleton className="h-8 w-10" />
                )}
                <p className="text-sm text-muted-foreground">{t.photosInGallery}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-muted/30 p-5">
        <h2 className="font-heading text-lg font-semibold">{t.quickTips}</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>
            • {t.tip1Before}
            <Link className="font-medium text-primary" href="/admin/pigs">
              {t.tip1LinkText}
            </Link>
            {t.tip1After}
          </li>
          <li>• {t.tip2}</li>
          <li>
            • {t.tip3Before}
            <Link className="font-medium text-primary" href="/admin/farm-info">
              {t.tip3LinkText}
            </Link>
            {t.tip3After}
          </li>
        </ul>
      </div>
    </div>
  );
}
