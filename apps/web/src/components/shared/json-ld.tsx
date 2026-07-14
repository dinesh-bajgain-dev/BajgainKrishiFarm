/**
 * Renders a schema.org JSON-LD block. Data comes from our own builders in
 * lib/seo.ts (never user input), so the JSON.stringify injection is safe;
 * "<" is escaped anyway to keep any future string content from closing the
 * script tag early.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
