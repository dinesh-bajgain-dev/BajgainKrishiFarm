import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

const SUGGESTED_LINKS = [
  { href: "/", key: "home" },
  { href: "/piglets", key: "piglets" },
  { href: "/breeding-pigs", key: "breedingPigs" },
  { href: "/gallery", key: "gallery" },
  { href: "/contact", key: "contact" },
] as const;

export default async function NotFound() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">404</p>
      <h1 className="mt-4 font-heading text-4xl font-semibold sm:text-5xl">
        {locale === "ne" ? "पृष्ठ फेला परेन" : "Page not found"}
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        {locale === "ne"
          ? `तपाईंले खोज्नुभएको पृष्ठ अवस्थित छैन। ${SITE_NAME} का यी पृष्ठहरू हेर्नुहोस्:`
          : `The page you're looking for doesn't exist. Try one of these pages from ${SITE_NAME}:`}
      </p>
      <nav aria-label={locale === "ne" ? "सुझाव गरिएका पृष्ठहरू" : "Suggested pages"} className="mt-8">
        <ul className="flex flex-wrap items-center justify-center gap-3">
          {SUGGESTED_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex items-center rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
              >
                {dict.nav[link.key]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
