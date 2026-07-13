"use client";

import { useAdminLocale, setAdminLocale } from "@/lib/use-admin-locale";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function AdminLanguageToggle({ className }: { className?: string }) {
  const locale = useAdminLocale();

  function select(next: Locale) {
    if (next !== locale) setAdminLocale(next);
  }

  return (
    <div
      className={cn(
        "flex items-center rounded-full border border-border bg-background p-0.5 text-xs font-semibold",
        className
      )}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => select("en")}
        aria-pressed={locale === "en"}
        className={cn(
          "rounded-full px-2.5 py-1 transition-colors",
          locale === "en" ? "bg-primary text-primary-foreground" : "text-foreground/60 hover:text-foreground"
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => select("ne")}
        aria-pressed={locale === "ne"}
        className={cn(
          "rounded-full px-2.5 py-1 transition-colors",
          locale === "ne" ? "bg-primary text-primary-foreground" : "text-foreground/60 hover:text-foreground"
        )}
      >
        नेपाली
      </button>
    </div>
  );
}
