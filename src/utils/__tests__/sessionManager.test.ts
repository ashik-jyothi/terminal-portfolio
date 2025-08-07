/**
 * Session Manager Tests
 * Tests for session lifecycle, cleanup, and logging functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import SessionManager, { getSessionManager, initializeSessionManager } from '../sessionManager';

// Mock console methods
const mockConsole = {
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn()
};

vi.stubGlobal('console', mockConsole);

describe('SessionManager', () => {
  let sessionManager: SessionManager;

  beforeEach(() => {
    sessionManager = new SessionManager({
      enableLogging: true,
      logLevel: 'debug',
      maxSessions: 5,
      sessionTimeout: 1000 // 1 second for testing
    });
    
    // Clear console mocks
    mockConsole.log.mockClear();
    mockConsole.error.mockClear();
    mockConsole.warn.mockClear();
  });

  afterEach(async () => {
    await sessionManager.shutdown();
  });

  describe('Session Creation', () => {
    it('should create a new session with unique ID', () => {
      const sessionId = sessionManager.createSession();
      
      expect(sessionId).toBeDefined();
      expect(typeof sessionId).toBe('string');
      expect(sessionId).toMatch(/^session_/);
      
      const session = sessionManager.getSession(sessionId);
      expect(session).toBeDefined();
      expect(session?.id).toBe(sessionId);
      expect(session?.startTime).toBeInstanceOf(Date);
      expect(session?.sectionsVisited).toEqual([]);
    });

    it('should create sessions with custom IDs', () => {
      const customId = 'custom-session-123';
      const sessionId = sessionManager.createSession(customId);
      
      expect(sessionId).toBe(customId);
      
      const session = sessionManager.getSession(sessionId);
      expect(session?.id).toBe(customId);
    });

    it('should enforce maximum session limit', () => {
      // Create maximum number of sessions
      const sessionIds = [];
      for (let i = 0; i < 5; i++) {
        sessionIds.push(sessionManager.createSession());
      }

      // Creating one more should trigger cleanup
      const newSessionId = sessionManager.createSession();
      expect(newSessionId).toBeDefined();
      
      // Should have logged a warning about max sessions
      expect(mockConsole.warn).toHaveBeenCalledWith(
        expect.stringContaining('Maximum sessions reached')
      );
    });
  });

  describe('Session Activity', () => {
    it('should update session activity', (done) => {
      const sessionId = sessionManager.createSession();
      const initialSession = sessionManager.getSession(sessionId);
      
      // Wait a bit to ensure timestamp difference
      setTimeout(() => {
        sessionManager.updateActivity(sessionId, 'about');
        
        const updatedSession = sessionManager.getSession(sessionId);
        expect(updatedSession?.lastActivity.getTime()).toBeGreaterThan(
          initialSession!.lastActivity.getTime()
        );
        expect(updatedSession?.sectionsVisited).toContain('about');
        done();
      }, 10);
    });

    it('should track unique sections visited', () => {
      const sessionId = sessionManager.createSession();
      
      sessionManager.updateActivity(sessionId, 'about');
      sessionManager.updateActivity(sessionId, 'skills');
      sessionManager.updateActivity(sessionId, 'about'); // duplicate
      
      const session = sessionManager.getSession(sessionId);
      expect(session?.sectionsVisited).toEqual(['about', 'skills']);
    });

    it('should update terminal size', () => {
      const sessionId = sessionManager.createSession();
      const terminalSize = { width: 120, height: 40 };
      
      sessionManager.updateTerminalSize(sessionId, terminalSize);
      
      const session = sessionManager.getSession(sessionId);
      expect(session?.terminalSize).toEqual(terminalSize);
    });
  });

  describe('Session Termination', () => {
    it('should end session with reason', () => {
      const sessionId = sessionManager.createSession();
      
      sessionManager.endSession(sessionId, 'disconnect');
      
      const session = sessionManager.getSession(sessionId);
      expect(session).toBeUndefined();
      
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining(`Session ended: ${sessionId} (disconnect)`)
      );
    });

    it('should handle session timeout', (done) => {
      const sessionId = sessionManager.createSession();
      
      // Wait for timeout (1 second + buffer)
      setTimeout(() => {
        const session = sessionManager.getSession(sessionId);
        expect(session).toBeUndefined();
        
        expect(mockConsole.log).toHaveBeenCalledWith(
          expect.stringContaining(`Session ended: ${sessionId} (timeout)`)
        );
        done();
      }, 1200);
    });

    it('should reset timeout on activity', (done) => {
      const sessionId = sessionManager.createSession();
      
      // Update activity after 500ms (before timeout)
      setTimeout(() => {
        sessionManager.updateActivity(sessionId);
      }, 500);
      
      // Check session still exists after original timeout period
      setTimeout(() => {
        const session = sessionManager.getSession(sessionId);
        expect(session).toBeDefined();
        done();
      }, 1200);
    });
  });

  describe('Session Statistics', () => {
    it('should provide accurate statistics', () => {
      const sessionId1 = sessionManager.createSession();
      const sessionId2 = sessionManager.createSession();
      
      sessionManager.updateActivity(sessionId1, 'about');
      sessionManager.updateActivity(sessionId1, 'skills');
      sessionManager.updateActivity(sessionId2, 'about');
      
      const stats = sessionManager.getStats();
      
      expect(stats.activeSessions).toBe(2);
      expect(stats.totalSessions).toBe(2);
      expect(stats.mostVisitedSections).toContainEqual({
        section: 'about',
        count: 2
      });
    });
  });

  describe('Graceful Shutdown', () => {
    it('should end all sessions on shutdown', async () => {
      const sessionId1 = sessionManager.createSession();
      const sessionId2 = sessionManager.createSession();
      
      expect(sessionManager.getActiveSessions()).toHaveLength(2);
      
      await sessionManager.shutdown();
      
      expect(sessionManager.getActiveSessions()).toHaveLength(0);
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('Session manager shutting down')
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent session updates gracefully', () => {
      sessionManager.updateActivity('non-existent-session', 'about');
      
      expect(mockConsole.warn).toHaveBeenCalledWith(
        expect.stringContaining('Attempted to update non-existent session')
      );
    });

    it('should prevent session creation during shutdown', async () => {
      await sessionManager.shutdown();
      
      expect(() => {
        sessionManager.createSession();
      }).toThrow('Session manager is shutting down');
    });
  });
});

describe('Global Session Manager', () => {
  afterEach(async () => {
    const manager = getSessionManager();
    await manager.shutdown();
  });

  it('should return singleton instance', () => {
    const manager1 = getSessionManager();
    const manager2 = getSessionManager();
    
    expect(manager1).toBe(manager2);
  });

  it('should initialize new instance', () => {
    const manager1 = getSessionManager();
    const manager2 = initializeSessionManager();
    
    expect(manager1).not.toBe(manager2);
  });
});