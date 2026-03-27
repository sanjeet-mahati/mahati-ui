const path = require('path');

const repoRoot = path.join(__dirname, '..');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  outputFileTracingRoot: repoRoot,

  // Turbopack config for Next.js 16
  turbopack: {
    resolveAlias: {
      '@/components': path.join(__dirname, '../library/src/components'),
          '@/styles': path.join(__dirname, '../library/src/styles'),
    },
  },
};

module.exports = nextConfig;