module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(ts|tsx)$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.test.json',
            },
        ],
    },
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/fileMock.js',
    },
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};