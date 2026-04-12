import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/ll',
        destination: '/ll/index.html',
      },
    ];
  },
};

export default nextConfig;
