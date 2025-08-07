/**
 * useSession Hook Tests
 * Tests for React session management hook
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useSession, useSessionStats } from '../useSession';
import { initializeSessionManager } from '../../utils/sessionManager';

// Mock console methods
const mockConsole = {
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn()
};

vi.stubGlobal('console', mockConsole);

describe('useSession', () => {
  beforeEach(() => {
    // Initialize fresh session manager for each test
    initializeSessionManager({
      enableLogging: false, // Disable logging for cleaner tests
      sessionTimeout: 5000 // 5 seconds
    });
    
    mockConsole.log.mockClear();
    mockConsole.error.mockClear();
    mockConsole.warn.mockClear();
  });

  afterEach(async () => {
    // Clean up any remaining sessions
    const { getSessionManager } = await import('../../utils/sessionManager');
    const manager = getSessionManager();
    await manager.shutdown();
  });

  it('should be defined and exportable', () => {
    expect(useSession).toBeDefined();
    expect(typeof useSession).toBe('function');
  });

  it('should be importable with session stats', () => {
    expect(useSessionStats).toBeDefined();
    expect(typeof useSessionStats).toBe('function');
  });
});