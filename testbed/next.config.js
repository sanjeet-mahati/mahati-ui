const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Turbopack config for Next.js 16
  turbopack: {
    resolveAlias: {
      '@/components': path.join(__dirname, '../library/src/components'),
    },
  },
};

module.exports = nextConfig;