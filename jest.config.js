module.exports = {
    roots: ["<rootDir>/src"],
    testMatch: [
        "**/__tests__/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)",
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    moduleNameMapper : {
        '\\.(css)$': '<rootDir>/src/contentScript/buttonInjector/__mocks__/css.ts'
    },
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ['./jest.setup.js'],
};
