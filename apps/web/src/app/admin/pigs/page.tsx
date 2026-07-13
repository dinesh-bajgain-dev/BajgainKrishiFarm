"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { EntityImage } from "@/components/shared/entity-image";
import { Skeleton } from "@/components/ui/skeleton";
import { adminApiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { getAdminDictionary } from "@/lib/admin-i18n";
import { loc } from "@/lib/i18n";
import { useAdminLocale } from "@/lib/use-admin-locale";
import type { Pig } from "@/types/entities";

const STATUS_STYLES: Record<Pig["status"], string> = {
  available: "bg-emerald-600 text-white",
  reserved: "bg-amber-500 text-white",
  sold: "bg-zinc-500 text-white",
};

export default function AdminPigsPage() {
  const locale = useAdminLocale();
  const t = getAdminDictionary(locale).pigsList;
  const [pigs, setPigs] = useState<Pig[] | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const statusLabels: Record<Pig["status"], string> = {
    available: t.statusAvailable,
    reserved: t.statusReserved,
    sold: t.statusSold,
  };
  const typeLabels: Record<Pig["listing_type"], string> = {
    piglet: t.typePiglet,
    breeding: t.typeBreeding,
  };
  const filters = [
    { value: "all", label: t.filterAll },
    { value: "piglet", label: t.filterPiglets },
    { value: "breeding", label: t.filterBreeding },
  ] as const;

  useEffect(() => {
    adminApiFetch<Pig[]>("/api/pigs/")
      .then(setPigs)
      .catch(() => {
        toast.error(t.loadFailedToast);
        setPigs([]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(pig: Pig) {
    if (!confirm(t.deleteConfirm(loc(pig, "name", locale)))) return;
    setDeletingId(pig.id);
    try {
      await adminApiFetch(`/api/pigs/${pig.id}`, { method: "DELETE" });
      toast.success(t.deletedToast);
      setPigs((prev) => prev?.filter((p) => p.id !== pig.id) ?? null);
    } catch {
      toast.error(t.deleteFailedToast);
    } finally {
      setDeletingId(null);
    }
  }

  const visible = pigs?.filter((pig) => filter === "all" || pig.listing_type === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold">{t.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>
        </div>
        <LinkButton size="lg" href="/admin/pigs/new">
          <Plus className="size-5" /> {t.addPig}
        </LinkButton>
      </div>

      <div className="mt-6 flex gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              filter === f.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-foreground/70 hover:bg-muted"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {pigs === null && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      )}

      {visible && visible.length === 0 && (
        <p className="mt-10 text-center text-muted-foreground">{t.emptyState}</p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible?.map((pig) => {
          const name = loc(pig, "name", locale);
          const breed = loc(pig, "breed", locale);
          return (
            <div
              key={pig.id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <Link href={`/admin/pigs/${pig.id}`} className="relative block aspect-[16/10]">
                <EntityImage
                  src={pig.image_urls[0] ?? null}
                  alt={name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                <span
                  className={cn(
                    "absolute right-2 top-2 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    STATUS_STYLES[pig.status]
                  )}
                >
                  {statusLabels[pig.status]}
                </span>
              </Link>
              <div className="p-4">
                <p className="font-heading font-semibold">{name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {typeLabels[pig.listing_type]} · {breed}
                </p>
                <div className="mt-3 flex gap-2">
                  <LinkButton href={`/admin/pigs/${pig.id}`} size="sm" className="flex-1">
                    <Pencil className="size-4" /> {t.edit}
                  </LinkButton>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={deletingId === pig.id}
                    onClick={() => handleDelete(pig)}
                    aria-label={t.deleteAria(name)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
