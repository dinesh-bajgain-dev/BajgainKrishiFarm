"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** EN / नेपाली switcher: stores the choice in a cookie and re-renders the page. */
export function LanguageToggle({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setLocale(next: Locale) {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div
      className={cn(
        "flex items-center rounded-full border border-border bg-background p-0.5 text-xs font-semibold",
        pending && "opacity-60"
      )}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
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
        onClick={() => setLocale("ne")}
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
