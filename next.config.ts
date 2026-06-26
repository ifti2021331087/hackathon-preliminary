import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/health', destination: '/api/health' },
      { source: '/analyze-ticket', destination: '/api/analyze-ticket' },
    ]
  },
};

export default nextConfig;
