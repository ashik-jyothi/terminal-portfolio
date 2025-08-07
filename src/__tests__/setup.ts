/**
 * Test setup file
 * Global test configuration and mocks
 */

import { vi } from 'vitest';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Mock process.exit to prevent tests from actually exiting
const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error('process.exit called');
});

// Clean up mocks after each test
afterEach(() => {
  vi.clearAllMocks();
  mockExit.mockClear();
});