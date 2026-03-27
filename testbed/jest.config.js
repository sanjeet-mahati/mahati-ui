module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  moduleDirectories: ['node_modules', '<rootDir>/', '<rootDir>/node_modules'],
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
  },
  moduleNameMapper: {
    // ── Assets ────────────────────────────────────────────────────────────────
 "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg|webp)$': '<rootDir>/__mocks__/fileMock.js',

    // ── Package import → library src (for Jest, bypasses dist) ───────────────
    '^@mahatisystems/mahati-ui-components/styles$': 'identity-obj-proxy',
    '^@mahatisystems/mahati-ui-components$': '<rootDir>/../library/src/index',
    '^@mahatisystems/mahati-ui-components/(.*)$': '<rootDir>/../library/src/$1',

    // ── @/components/* → library/src/components/ ─────────────────────────────
    '^@/components/(.*)$': '<rootDir>/../library/src/components/$1',

    // ── @/lib (exact) → library/src/index ────────────────────────────────────
    '^@/lib$': '<rootDir>/../library/src/index',

    // ── @/lib/src/* and @/lib/* → library/src/ ───────────────────────────────
    '^@/lib/src/(.*)$': '<rootDir>/../library/src/$1',
    '^@/lib/(.*)$': '<rootDir>/../library/src/$1',

    // ── @/navigation/context-provider → explicit .tsx ────────────────────────
    '^@/navigation/context-provider$': '<rootDir>/src/navigation/context-provider.tsx',

    // ── @/navigation/* → src/navigation/ ─────────────────────────────────────
    '^@/navigation/(.*)$': '<rootDir>/src/navigation/$1',

    // ── @/app/* → src/app/ ───────────────────────────────────────────────────
    '^@/app/(.*)$': '<rootDir>/src/app/$1',

    // ── Relative ../CodePreview and ../PropsTable ─────────────────────────────
    '^\\.\\./CodePreview$': '<rootDir>/src/app/CodePreview',
    '^\\.\\./PropsTable$': '<rootDir>/src/app/PropsTable',

    // ── @/ catch-all → src/ ──────────────────────────────────────────────────
    '^@/(.*)$': '<rootDir>/src/$1',

    // ── Force all react imports to resolve from testbed/node_modules ─────────
    "^react$": "<rootDir>/node_modules/react",
    "^react/(.*)$": "<rootDir>/node_modules/react/$1",
    "^react-dom$": "<rootDir>/node_modules/react-dom",
    "^react-dom/(.*)$": "<rootDir>/node_modules/react-dom/$1",
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 30000,
};