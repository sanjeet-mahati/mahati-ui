const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Path to your Next.js app to load next.config.js and .env files properly
  dir: './',
});

// Custom Jest config
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // adjust if your alias is different
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // mocks CSS imports
  },
  transformIgnorePatterns: [
    '/node_modules/',
  ],
};

module.exports = createJestConfig(customJestConfig);
