import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-block rounded-full bg-accent/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground/80">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-balance font-heading text-3xl font-semibold sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-balance text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
