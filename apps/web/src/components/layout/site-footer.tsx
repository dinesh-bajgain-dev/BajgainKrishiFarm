import Link from "next/link";
import { Mail, MapPin, Phone, PiggyBank } from "lucide-react";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/shared/social-icons";
import { apiFetchOrNull } from "@/lib/api";
import { NAV_KEYS, SITE_NAME } from "@/lib/constants";
import { getDictionary, loc } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import type { FarmInfo } from "@/types/entities";

export async function SiteFooter() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const farmInfo = await apiFetchOrNull<FarmInfo>("/api/farm-info/");
  const farmName = loc(farmInfo, "farm_name", locale) || SITE_NAME;
  const address = loc(farmInfo, "address", locale);

  return (
    <footer className="border-t border-border/60 bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-3 lg:col-span-2">
          <Link href="/" className="flex items-center gap-2 font-heading text-lg font-semibold">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <PiggyBank className="size-5" />
            </span>
            {farmName}
          </Link>
          <p className="max-w-md text-sm text-muted-foreground">
            {loc(farmInfo, "description", locale)}
          </p>
          <div className="flex gap-3 pt-2">
            {farmInfo?.facebook_url && (
              <a href={farmInfo.facebook_url} target="_blank" rel="noreferrer" aria-label="Facebook"
                className="flex size-9 items-center justify-center rounded-full bg-background text-foreground/70 transition-all hover:-translate-y-0.5 hover:text-primary hover:shadow-md">
                <FacebookIcon className="size-4" />
              </a>
            )}
            {farmInfo?.instagram_url && (
              <a href={farmInfo.instagram_url} target="_blank" rel="noreferrer" aria-label="Instagram"
                className="flex size-9 items-center justify-center rounded-full bg-background text-foreground/70 transition-all hover:-translate-y-0.5 hover:text-primary hover:shadow-md">
                <InstagramIcon className="size-4" />
              </a>
            )}
            {farmInfo?.youtube_url && (
              <a href={farmInfo.youtube_url} target="_blank" rel="noreferrer" aria-label="YouTube"
                className="flex size-9 items-center justify-center rounded-full bg-background text-foreground/70 transition-all hover:-translate-y-0.5 hover:text-primary hover:shadow-md">
                <YoutubeIcon className="size-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground/80">
            {dict.footer.explore}
          </h3>
          <ul className="mt-4 space-y-2">
            {NAV_KEYS.map(({ href, key }) => (
              <li key={href}>
                <Link href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {dict.nav[key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground/80">
            {dict.footer.contact}
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {address && (
              <li className="flex gap-2">
                <MapPin className="size-4 shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
            )}
            {farmInfo?.phone && (
              <li className="flex gap-2 items-center">
                <Phone className="size-4 shrink-0" />
                <a href={`tel:${farmInfo.phone}`} className="hover:text-primary transition-colors">
                  {farmInfo.phone}
                </a>
              </li>
            )}
            {farmInfo?.email && (
              <li className="flex gap-2 items-center">
                <Mail className="size-4 shrink-0" />
                <a href={`mailto:${farmInfo.email}`} className="hover:text-primary transition-colors">
                  {farmInfo.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} {farmName}. {dict.footer.rights}
      </div>
    </footer>
  );
}
