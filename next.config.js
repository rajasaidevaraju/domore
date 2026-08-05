const nextConfig = {
  distDir: 'build',
  allowedDevOrigins: ['192.168.1.8'],
  async redirects() {
    return [
      // /filter managed performers and categories rather than filtering
      // anything; keep old bookmarks working after the rename to /tags
      { source: '/filter', destination: '/tags', permanent: true },
    ];
  },
};

module.exports = nextConfig
