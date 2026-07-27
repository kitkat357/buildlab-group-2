import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config = {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironment: "jsdom",
};

export default createJestConfig(config);
