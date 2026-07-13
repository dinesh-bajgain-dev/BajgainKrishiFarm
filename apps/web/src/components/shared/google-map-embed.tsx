const GOOGLE_MAPS_HOSTNAMES = new Set([
  "www.google.com",
  "google.com",
  "maps.google.com",
]);

function extractIframeSrc(embedCode: string | null | undefined): string | null {
  if (!embedCode) return null;

  const srcMatch = embedCode.match(
    /<iframe\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i,
  );
  if (!srcMatch) return null;

  try {
    const parsed = new URL(srcMatch[1]);
    if (!GOOGLE_MAPS_HOSTNAMES.has(parsed.hostname)) return null;
    if (
      !parsed.pathname.includes("/embed") &&
      parsed.searchParams.get("output") !== "embed"
    ) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export function GoogleMapEmbed({
  embedCode,
  label,
  className,
  placeholder,
}: {
  embedCode?: string | null;
  label: string;
  className?: string;
  placeholder?: string;
}) {
  const src = extractIframeSrc(embedCode);
  const wrapperClassName = ["max-w-full min-w-0", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClassName}>
      {src ? (
        <iframe
          title={`Map location of ${label}`}
          src={src}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-full w-full max-w-full rounded-2xl border border-border"
        />
      ) : (
        <div className="flex h-full max-w-full items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
          {placeholder ?? "Map location will be available soon."}
        </div>
      )}
    </div>
  );
}
