import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
    ],
  },
  turbopack: {
    // Silence root detection warning in monorepo-ish setups
    root: __dirname,
  },
};

export default nextConfig;
