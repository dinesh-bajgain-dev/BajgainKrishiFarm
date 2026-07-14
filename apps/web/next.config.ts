import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8001", pathname: "/uploads/**" },
    ],
  },
  turbopack: {
    // node_modules is hoisted to the npm-workspaces root by npm install,
    // so Turbopack needs the monorepo root (two levels up), not this app dir.
    root: path.join(process.cwd(), "..", ".."),
  },
  async headers() {
    return [
      {
        // The admin panel is a private tool; robots.txt only stops crawling,
        // this header stops indexing of any admin URL a crawler discovers.
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
