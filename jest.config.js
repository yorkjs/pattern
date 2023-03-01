module.exports = {
  rootDir: __dirname,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  moduleFileExtensions: ['ts', 'js'],
};