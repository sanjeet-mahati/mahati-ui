/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  webpack: (config:any) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/components': path.resolve(__dirname, '../library/src/components'),
      '@/lib': path.resolve(__dirname, '../library/src'),
    };
    return config;
  },
};

module.exports = nextConfig;