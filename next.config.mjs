import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    unoptimized: true,
  },

  experimental: {
    serverActions: {}
  },
  async rewrites() {
    return [
      { source: '/', destination: '/it' }
    ];
  }
};

export default withNextIntl(nextConfig);