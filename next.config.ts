import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint errors during production build
  },
  typescript: {
    ignoreBuildErrors: true, // Ignores TypeScript errors during production build
  },
};

export default nextConfig;
