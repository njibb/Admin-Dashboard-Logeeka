/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: 'https://api-cms.logeeka.id/:path*',
      },
    ];
  },
};

module.exports = nextConfig;