module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@public/(.*)$': '<rootDir>/public/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@styles/(.*)$': '<rootDir>/styles/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
    '^@core/(.*)$': '<rootDir>/core/$1',
  },
};