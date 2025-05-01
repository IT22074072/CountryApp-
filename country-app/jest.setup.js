// jest.setup.js
require('@testing-library/jest-dom');  // Modern import format

// Polyfill for TextEncoder and TextDecoder if they are not already defined
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Conditionally setup MSW if the server file exists
try {
  const { server } = require('./src/mocks/server');
  
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
} catch (error) {
  console.log('MSW server not found, skipping setup');
}
