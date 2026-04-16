import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // 🔥 Panggil dari brankas .env kamu!
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`, 
      },
    ]
  },
};

export default nextConfig;