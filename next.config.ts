import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // 🔥 INI KUNCINYA: (?!auth).* artinya "bajak semua KECUALI kata auth"
        source: '/api/:path((?!auth).*)',
        destination: 'https://logeeka-magang.mokumuka.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;