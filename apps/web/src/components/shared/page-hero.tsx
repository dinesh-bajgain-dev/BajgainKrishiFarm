import { EntityImage } from "@/components/shared/entity-image";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  image?: string | null;
}) {
  return (
    <section className="relative flex h-[42vh] min-h-[300px] items-end overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <EntityImage src={image} alt="" fill priority className="animate-hero-zoom object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <span
          className="animate-fade-up inline-block rounded-full bg-accent/90 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent-foreground"
          style={{ animationDelay: "60ms" }}
        >
          {eyebrow}
        </span>
        <h1
          className="animate-fade-up mt-4 font-heading text-4xl font-semibold text-white sm:text-5xl"
          style={{ animationDelay: "160ms" }}
        >
          {title}
        </h1>
        {description && (
          <p
            className="animate-fade-up mt-3 max-w-2xl text-lg text-white/90"
            style={{ animationDelay: "260ms" }}
          >
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
