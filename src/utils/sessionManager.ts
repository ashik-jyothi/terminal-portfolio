/**
 * Session Management Utilities
 * Handles session lifecycle, cleanup, and logging for terminal portfolio
 */

import { EventEmitter } from 'events';

export interface SessionInfo {
  id: string;
  startTime: Date;
  endTime?: Date;
  userAgent?: string;
  terminalSize?: { width: number; height: number };
  sectionsVisited: string[];
  lastActivity: Date;
}

export interface SessionManagerOptions {
  maxSessions?: number;
  sessionTimeout?: number; // in milliseconds
  enableLogging?: boolean;
  logLevel?: 'info' | 'debug' | 'error';
}

class SessionManager extends EventEmitter {
  private sessions: Map<string, SessionInfo> = new Map();
  private cleanupTimers: Map<string, NodeJS.Timeout> = new Map();
  private options: Required<SessionManagerOptions>;
  private isShuttingDown = false;

  constructor(options: SessionManagerOptions = {}) {
    super();
    
    this.options = {
      maxSessions: options.maxSessions ?? 100,
      sessionTimeout: options.sessionTimeout ?? 30 * 60 * 1000, // 30 minutes
      enableLogging: options.enableLogging ?? true,
      logLevel: options.logLevel ?? 'info'
    };

    // Set up graceful shutdown handlers
    this.setupShutdownHandlers();
  }

  /**
   * Create a new session
   */
  createSession(sessionId?: string): string {
    if (this.isShuttingDown) {
      throw new Error('Session manager is shutting down');
    }

    const id = sessionId || this.generateSessionId();
    
    // Check session limits
    if (this.sessions.size >= this.options.maxSessions) {
      this.log('warn', `Maximum sessions reached (${this.options.maxSessions}). Cleaning up oldest sessions.`);
      this.cleanupOldestSessions(Math.floor(this.options.maxSessions * 0.1)); // Remove 10% of sessions
    }

    const session: SessionInfo = {
      id,
      startTime: new Date(),
      sectionsVisited: [],
      lastActivity: new Date()
    };

    this.sessions.set(id, session);
    this.setupSessionTimeout(id);
    
    this.log('info', `Session created: ${id}`);
    this.emit('sessionCreated', session);
    
    return id;
  }

  /**
   * Update session activity
   */
  updateActivity(sessionId: string, section?: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      this.log('warn', `Attempted to update non-existent session: ${sessionId}`);
      return;
    }

    session.lastActivity = new Date();
    
    if (section && !session.sectionsVisited.includes(section)) {
      session.sectionsVisited.push(section);
      this.log('debug', `Session ${sessionId} visited section: ${section}`);
    }

    // Reset timeout
    this.setupSessionTimeout(sessionId);
    this.emit('sessionActivity', session);
  }

  /**
   * Update terminal size for session
   */
  updateTerminalSize(sessionId: string, size: { width: number; height: number }): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.terminalSize = size;
      this.updateActivity(sessionId);
    }
  }

  /**
   * End a session
   */
  endSession(sessionId: string, reason: 'disconnect' | 'timeout' | 'shutdown' | 'error' = 'disconnect'): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return;
    }

    session.endTime = new Date();
    const duration = session.endTime.getTime() - session.startTime.getTime();
    
    this.log('info', `Session ended: ${sessionId} (${reason}) - Duration: ${Math.round(duration / 1000)}s`);
    
    // Clear timeout
    const timer = this.cleanupTimers.get(sessionId);
    if (timer) {
      clearTimeout(timer);
      this.cleanupTimers.delete(sessionId);
    }

    this.emit('sessionEnded', { ...session, reason, duration });
    this.sessions.delete(sessionId);
  }

  /**
   * Get session information
   */
  getSession(sessionId: string): SessionInfo | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Get all active sessions
   */
  getActiveSessions(): SessionInfo[] {
    return Array.from(this.sessions.values());
  }

  /**
   * Get session statistics
   */
  getStats(): {
    activeSessions: number;
    totalSessions: number;
    averageSessionDuration: number;
    mostVisitedSections: { section: string; count: number }[];
  } {
    const activeSessions = this.sessions.size;
    const allSessions = Array.from(this.sessions.values());
    
    // Calculate average duration for completed sessions
    const completedSessions = allSessions.filter(s => s.endTime);
    const averageSessionDuration = completedSessions.length > 0
      ? completedSessions.reduce((sum, s) => sum + (s.endTime!.getTime() - s.startTime.getTime()), 0) / completedSessions.length
      : 0;

    // Count section visits
    const sectionCounts = new Map<string, number>();
    allSessions.forEach(session => {
      session.sectionsVisited.forEach(section => {
        sectionCounts.set(section, (sectionCounts.get(section) || 0) + 1);
      });
    });

    const mostVisitedSections = Array.from(sectionCounts.entries())
      .map(([section, count]) => ({ section, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      activeSessions,
      totalSessions: allSessions.length,
      averageSessionDuration: Math.round(averageSessionDuration / 1000), // in seconds
      mostVisitedSections
    };
  }

  /**
   * Graceful shutdown - end all sessions
   */
  async shutdown(): Promise<void> {
    this.isShuttingDown = true;
    this.log('info', 'Session manager shutting down...');

    // End all active sessions
    const sessionIds = Array.from(this.sessions.keys());
    sessionIds.forEach(id => this.endSession(id, 'shutdown'));

    // Clear all timers
    this.cleanupTimers.forEach(timer => clearTimeout(timer));
    this.cleanupTimers.clear();

    this.emit('shutdown');
    this.log('info', 'Session manager shutdown complete');
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    return `session_${timestamp}_${random}`;
  }

  /**
   * Setup session timeout
   */
  private setupSessionTimeout(sessionId: string): void {
    // Clear existing timer
    const existingTimer = this.cleanupTimers.get(sessionId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = setTimeout(() => {
      this.endSession(sessionId, 'timeout');
    }, this.options.sessionTimeout);

    this.cleanupTimers.set(sessionId, timer);
  }

  /**
   * Clean up oldest sessions
   */
  private cleanupOldestSessions(count: number): void {
    const sessions = Array.from(this.sessions.entries())
      .sort(([, a], [, b]) => a.lastActivity.getTime() - b.lastActivity.getTime())
      .slice(0, count);

    sessions.forEach(([sessionId]) => {
      this.endSession(sessionId, 'timeout');
    });
  }

  /**
   * Setup graceful shutdown handlers
   */
  private setupShutdownHandlers(): void {
    // Only set up handlers if we're not in a test environment
    if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
      return;
    }

    // Increase max listeners to prevent warnings in multi-session scenarios
    process.setMaxListeners(20);

    const shutdownHandler = () => {
      this.shutdown().then(() => {
        process.exit(0);
      }).catch((error) => {
        this.log('error', `Error during shutdown: ${error.message}`);
        process.exit(1);
      });
    };

    process.on('SIGINT', shutdownHandler);
    process.on('SIGTERM', shutdownHandler);
    process.on('SIGHUP', shutdownHandler);

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      this.log('error', `Uncaught exception: ${error.message}`);
      this.shutdown().finally(() => process.exit(1));
    });

    process.on('unhandledRejection', (reason) => {
      this.log('error', `Unhandled rejection: ${reason}`);
      this.shutdown().finally(() => process.exit(1));
    });
  }

  /**
   * Logging utility
   */
  private log(level: 'info' | 'debug' | 'error' | 'warn', message: string): void {
    if (!this.options.enableLogging) return;

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] SessionManager: ${message}`;

    switch (level) {
      case 'error':
        console.error(logMessage);
        break;
      case 'warn':
        console.warn(logMessage);
        break;
      case 'debug':
        if (this.options.logLevel === 'debug') {
          console.log(logMessage);
        }
        break;
      case 'info':
      default:
        if (this.options.logLevel !== 'error') {
          console.log(logMessage);
        }
        break;
    }
  }
}

// Global session manager instance
let globalSessionManager: SessionManager | null = null;

/**
 * Get or create global session manager instance
 */
export function getSessionManager(options?: SessionManagerOptions): SessionManager {
  if (!globalSessionManager) {
    globalSessionManager = new SessionManager(options);
  }
  return globalSessionManager;
}

/**
 * Initialize session management for the application
 */
export function initializeSessionManager(options?: SessionManagerOptions): SessionManager {
  globalSessionManager = new SessionManager(options);
  return globalSessionManager;
}

export default SessionManager;