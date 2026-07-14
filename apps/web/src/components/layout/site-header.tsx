import Link from "next/link";
import { PiggyBank } from "lucide-react";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { LinkButton } from "@/components/ui/link-button";
import { NAV_KEYS } from "@/lib/constants";
import { getDictionary, loc } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { apiFetchOrNull } from "@/lib/api";
import type { FarmInfo } from "@/types/entities";

export async function SiteHeader() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const farmInfo = await apiFetchOrNull<FarmInfo>("/api/farm-info/");
  const farmName = loc(farmInfo, "farm_name", locale) || "Bajgain Krishi Farm";
  const navLinks = NAV_KEYS.map(({ href, key }) => ({ href, label: dict.nav[key] }));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label={farmName}
          className="flex items-center gap-2 font-heading text-lg font-semibold"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <PiggyBank aria-hidden className="size-5" />
          </span>
          <span className="hidden sm:inline">{farmName}</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-underline rounded-lg px-3 py-2 text-sm font-medium text-foreground/75 hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <LanguageToggle locale={locale} />
          <ThemeToggle />
          <LinkButton className="hidden xl:inline-flex" href="/contact">
            {dict.common.contactUs}
          </LinkButton>
          <MobileNav siteName={farmName} links={navLinks} />
        </div>
      </div>
    </header>
  );
}
