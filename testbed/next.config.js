const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Add this section
  experimental: {
    turbo: {
      resolveAlias: {
        '@/components': path.join(__dirname, '../library/src/components'),
      },
    },
  },

  // Webpack config
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/components': path.join(__dirname, '../library/src/components'),
    };

    // Add this to help with module resolution
    config.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx', ...config.resolve.extensions];

    return config;
  },
};

module.exports = nextConfig;