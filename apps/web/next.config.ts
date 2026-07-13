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
};

export default nextConfig;
