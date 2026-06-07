module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowJs: true,
        baseUrl: '.',
        paths: {
          '@components/*': ['components/*'],
          '@public/*': ['public/*'],
          '@config/*': ['config/*'],
          '@styles/*': ['styles/*'],
          '@utils/*': ['utils/*'],
          '@core/*': ['core/*'],
        },
      },
    }],
  },
  moduleNameMapper: {
    // jspdf 4.x 的 exports map 在 jsdom 下會解析到 ESM build，Jest 無法解析，改用 CJS build
    '^jspdf$': '<rootDir>/node_modules/jspdf/dist/jspdf.node.min.js',
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@public/(.*)$': '<rootDir>/public/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@styles/(.*)$': '<rootDir>/styles/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
    '^@core/(.*)$': '<rootDir>/core/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
  },
  testMatch: [
    '<rootDir>/**/__tests__/**/*.(ts|tsx|js)',
    '<rootDir>/**/*.(test|spec).(ts|tsx|js)',
  ],
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'pages/**/*.{ts,tsx}',
    'utils/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/coverage/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};