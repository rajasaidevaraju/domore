/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  allowedDevOrigins: ['192.168.2.90'],
  async rewrites() {
    return [
      {
        source: '/server/:path*',
        destination: process.env.SERVER_ADDRESS + '/:path*',
      },
    ];
  },
};

module.exports = nextConfig
