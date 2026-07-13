import Link from "next/link";
import { EntityImage } from "@/components/shared/entity-image";
import { cn } from "@/lib/utils";
import { formatAge, formatPrice, getDictionary, loc, type Locale } from "@/lib/i18n";
import type { Pig } from "@/types/entities";

const STATUS_STYLES: Record<Pig["status"], string> = {
  available: "bg-emerald-600 text-white",
  reserved: "bg-amber-500 text-white",
  sold: "bg-zinc-500 text-white",
};

export function PigCard({ pig, locale }: { pig: Pig; locale: Locale }) {
  const dict = getDictionary(locale);
  const age = formatAge(pig.date_of_birth, locale);
  const name = loc(pig, "name", locale);
  const breed = loc(pig, "breed", locale);

  return (
    <Link
      href={`/pigs/${pig.id}`}
      className="card-lift group block h-full overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <EntityImage
          src={pig.image_urls[0] ?? null}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={cn(
            "absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-md",
            STATUS_STYLES[pig.status]
          )}
        >
          {pig.status === "available" && <span className="pulse-dot" />}
          {dict.pig[pig.status]}
        </span>
        {pig.image_urls.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
            {pig.image_urls.length} 📷
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-heading text-lg font-semibold transition-colors group-hover:text-primary">
          {name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {breed} · {dict.pig[pig.gender]}
          {age ? ` · ${age}` : ""}
        </p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="font-semibold text-primary">{formatPrice(pig.price, locale)}</p>
          <span className="text-sm text-muted-foreground underline-offset-4 transition-colors group-hover:text-foreground group-hover:underline">
            {dict.pig.viewDetails} →
          </span>
        </div>
      </div>
    </Link>
  );
}
