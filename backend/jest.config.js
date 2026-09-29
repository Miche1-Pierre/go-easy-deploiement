/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  watchman: false,
  roots: ["<rootDir>/tests"],
  setupFiles: ["<rootDir>/tests/setup.ts"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.test.json" }],
  },
  moduleNameMapper: {
    "^@domain/(.*)$": "<rootDir>/src/domain/$1",
    "^@backoffice/(.*)$": "<rootDir>/src/backoffice/$1",
    "^@restapi/(.*)$": "<rootDir>/src/restapi/$1",
    "^@config/(.*)$": "<rootDir>/src/config/$1",
    "^@shared/(.*)$": "<rootDir>/src/$1",
  },
};
