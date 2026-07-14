import { ImageResponse } from "next/og";
import { API_URL, SITE_NAME, SITE_URL } from "@/lib/constants";
import type { AboutPage, FarmInfo } from "@/types/entities";

export const alt = `${SITE_NAME} — healthy piglets and breeding pigs from our family farm in Nepal`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Regenerate at most hourly so crawlers are served a cached PNG rather than
// re-fetching the farm's contact details on every request.
export const revalidate = 3600;

// Business-card palette (matches the cream/brown/green brand).
const CREAM = "#f4efe3";
const INK = "#2f2417";
const BROWN = "#5a4632";
const MUTED = "#6f5c46";
const GOLD = "#b98d3e";
const GREEN = "#2f5d3f";
const PIG = "#d9a58d";
const PIG_SHADE = "#c78d76";
const PIG_DARK = "#5c3b2e";

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate } });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

/** A friendly side-profile pig silhouette, composed from primitives. */
function PigGraphic() {
  return (
    <svg width={300} height={200} viewBox="0 0 300 200">
      {/* rear legs (shaded, behind body) */}
      <rect x={78} y={120} width={26} height={58} rx={12} fill={PIG_SHADE} />
      <rect x={190} y={126} width={26} height={54} rx={12} fill={PIG_SHADE} />
      {/* curly tail */}
      <path
        d="M60 96 C42 92 44 74 60 78 C74 81 70 66 58 68"
        fill="none"
        stroke={PIG}
        strokeWidth={9}
        strokeLinecap="round"
      />
      {/* body */}
      <ellipse cx={150} cy={112} rx={96} ry={62} fill={PIG} />
      {/* front legs */}
      <rect x={104} y={140} width={26} height={46} rx={12} fill={PIG} />
      <rect x={166} y={144} width={26} height={44} rx={12} fill={PIG} />
      {/* head */}
      <circle cx={232} cy={104} r={46} fill={PIG} />
      {/* ear */}
      <path d="M214 66 C210 46 232 44 236 60 C240 74 224 78 214 66 Z" fill={PIG_SHADE} />
      {/* snout */}
      <ellipse cx={274} cy={112} rx={21} ry={17} fill={PIG_SHADE} />
      <ellipse cx={270} cy={112} rx={3.4} ry={5} fill={PIG_DARK} />
      <ellipse cx={280} cy={112} rx={3.4} ry={5} fill={PIG_DARK} />
      {/* eye */}
      <circle cx={244} cy={92} r={5} fill={PIG_DARK} />
    </svg>
  );
}

const ICON_STROKE = { fill: "none", stroke: CREAM, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Icon({ name }: { name: "phone" | "mail" | "globe" | "pin" }) {
  return (
    <svg width={26} height={26} viewBox="0 0 24 24" {...ICON_STROKE}>
      {name === "phone" && (
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      )}
      {name === "mail" && (
        <g>
          <rect x={2} y={4} width={20} height={16} rx={2} />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </g>
      )}
      {name === "globe" && (
        <g>
          <circle cx={12} cy={12} r={10} />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </g>
      )}
      {name === "pin" && (
        <g>
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
          <circle cx={12} cy={10} r={3} />
        </g>
      )}
    </svg>
  );
}

function ContactRow({ icon, text }: { icon: "phone" | "mail" | "globe" | "pin"; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: 22 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 52,
          height: 52,
          borderRadius: 999,
          backgroundColor: BROWN,
        }}
      >
        <Icon name={icon} />
      </div>
      <div style={{ marginLeft: 20, fontSize: 30, color: INK }}>{text}</div>
    </div>
  );
}

/**
 * Site-wide social card, styled like the farm's business card: a cream "paper"
 * card with a pig graphic and wordmark on the left, and real contact details
 * (pulled from the API, with graceful fallbacks) on the right. Generated at
 * request time; route segments can still override it (pig detail pages use the
 * pig's own photo). English-only by design: the bundled OG font has no
 * Devanagari glyphs and crawlers see the English locale anyway.
 */
export default async function OpenGraphImage() {
  const [farm, about] = await Promise.all([
    fetchJson<FarmInfo>("/api/farm-info/"),
    fetchJson<AboutPage>("/api/about-page/"),
  ]);

  const farmName = (farm?.farm_name_en ?? SITE_NAME).toUpperCase();
  const owner = about?.owner_name;
  const since = farm?.established_year;
  const phone = farm?.phone;
  const email = farm?.email;
  const address = farm?.address_en;
  const rawHost = SITE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "");
  // Hide the website row for local/preview hosts so the card never shows a
  // placeholder-y "localhost:3000"; the real domain shows in production.
  const host = rawHost.startsWith("localhost") || rawHost.startsWith("127.") ? null : rawHost;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: CREAM,
        }}
      >
        {/* Decorative inner frame, like a printed card edge. */}
        <div
          style={{
            position: "absolute",
            top: 22,
            left: 22,
            right: 22,
            bottom: 22,
            borderRadius: 24,
            border: `2px solid ${GOLD}55`,
          }}
        />

        <div style={{ display: "flex", width: "100%", height: "100%", padding: "64px 70px", alignItems: "center" }}>
          {/* Left: pig graphic + wordmark */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 452,
            }}
          >
            <PigGraphic />
            <div
              style={{
                marginTop: 20,
                fontSize: farmName.length > 20 ? 40 : 48,
                fontWeight: 800,
                color: INK,
                letterSpacing: 1,
                textAlign: "center",
                lineHeight: 1.05,
              }}
            >
              {farmName}
            </div>
            <div
              style={{
                marginTop: 14,
                fontSize: 21,
                fontWeight: 600,
                color: GREEN,
                letterSpacing: 3,
              }}
            >
              PIGLETS · BREEDING PIGS
            </div>
            {since && (
              <div style={{ marginTop: 6, fontSize: 19, color: MUTED, letterSpacing: 1 }}>
                {`A small family farm since ${since}`}
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ width: 2, height: 400, backgroundColor: `${BROWN}33`, marginLeft: 44, marginRight: 48 }} />

          {/* Right: contact details */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: INK }}>
              {owner ?? "Bajgain Family Farm"}
            </div>
            <div style={{ marginTop: 4, fontSize: 24, color: MUTED }}>
              {owner ? "Proprietor & Farmer" : "A small family pig farm"}
            </div>

            <div style={{ display: "flex", flexDirection: "column", marginTop: 18 }}>
              {phone && <ContactRow icon="phone" text={phone} />}
              {email && <ContactRow icon="mail" text={email} />}
              {host && <ContactRow icon="globe" text={host} />}
              {address && <ContactRow icon="pin" text={address} />}
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
