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
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*", // Proxy to Backend
      },
      {
        source: "/media/:path*",
        destination: "http://127.0.0.1:8000/media/:path*", // Proxy Media files
      },
    ];
  },
};

export default nextConfig;
