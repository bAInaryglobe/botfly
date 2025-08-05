import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignore lint and type errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
