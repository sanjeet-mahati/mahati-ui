/** @type {import('next').NextConfig} */
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  outputFileTracingRoot: repoRoot,
  
  // Emotion configuration for React 19
  compiler: {
    emotion: true,
  },
  
  // Ensure proper transpilation of library components
  transpilePackages: [
    '@mahatisystems/mahati-ui-components',
    '@emotion/react',
    '@emotion/styled',
    'react-chartjs-2',
    'chart.js',
    'styled-components',
  ],
  
  // Module resolution configuration
  webpack: (config: any, { isServer }: any) => {
    // Ensure proper module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/components': path.resolve(__dirname, '../library/src/components'),
      '@/lib': path.resolve(__dirname, '../library/src'),
    };

    // Add module resolution for packages in library's node_modules
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '../library/node_modules'),
    ];

    // Add fallback for Node.js modules in client-side bundles
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    return config;
  },
  
  // Turbopack config for Next.js 16 (keeping existing)
  turbopack: {
    resolveAlias: {
      '@/components': path.join(__dirname, '../library/src/components'),
      '@/lib': path.join(__dirname, '../library/src'),
    },
  },
};

module.exports = nextConfig;