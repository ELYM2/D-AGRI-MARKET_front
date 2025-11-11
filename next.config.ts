import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Silence root detection warning in monorepo-ish setups
    root: __dirname,
  },
};

export default nextConfig;
