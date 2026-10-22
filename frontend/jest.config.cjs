module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
    // import.meta.env não existe no Jest: usamos um config "de mentira" nos testes.
    '^(\\.{1,2}/)+appConfig(\\.js)?$': '<rootDir>/src/__mocks__/appConfig.js',
  },
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/main.jsx', '!src/__mocks__/**'],
};
