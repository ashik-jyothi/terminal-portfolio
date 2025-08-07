/**
 * React hook for session management
 * Provides session lifecycle management for React components
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { getSessionManager, type SessionInfo } from '../utils/sessionManager';
import type { SectionType, TerminalDimensions } from '../types/app';

export interface UseSessionOptions {
  enableLogging?: boolean;
  sessionTimeout?: number;
  onSessionEnd?: (reason: string) => void;
}

export interface UseSessionReturn {
  sessionId: string;
  sessionInfo: SessionInfo | null;
  updateActivity: (section?: SectionType) => void;
  updateTerminalSize: (size: TerminalDimensions) => void;
  endSession: (reason?: string) => void;
  isActive: boolean;
}

/**
 * Hook for managing user session lifecycle
 */
export function useSession(options: UseSessionOptions = {}): UseSessionReturn {
  const sessionManager = getSessionManager({
    enableLogging: options.enableLogging ?? true,
    sessionTimeout: options.sessionTimeout ?? 30 * 60 * 1000, // 30 minutes
  });

  const [sessionId] = useState(() => sessionManager.createSession());
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [isActive, setIsActive] = useState(true);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Update session info when session changes
  useEffect(() => {
    const updateSessionInfo = () => {
      const info = sessionManager.getSession(sessionId);
      setSessionInfo(info || null);
    };

    // Initial update
    updateSessionInfo();

    // Listen for session events
    const handleSessionActivity = (session: SessionInfo) => {
      if (session.id === sessionId) {
        setSessionInfo({ ...session });
      }
    };

    const handleSessionEnded = (data: SessionInfo & { reason: string }) => {
      if (data.id === sessionId) {
        setIsActive(false);
        setSessionInfo(null);
        options.onSessionEnd?.(data.reason);
      }
    };

    sessionManager.on('sessionActivity', handleSessionActivity);
    sessionManager.on('sessionEnded', handleSessionEnded);

    // Cleanup function
    cleanupRef.current = () => {
      sessionManager.off('sessionActivity', handleSessionActivity);
      sessionManager.off('sessionEnded', handleSessionEnded);
    };

    return cleanupRef.current;
  }, [sessionId, sessionManager]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isActive) {
        sessionManager.endSession(sessionId, 'disconnect');
      }
      cleanupRef.current?.();
    };
  }, [sessionId, sessionManager, isActive]);

  // Update activity function
  const updateActivity = useCallback((section?: SectionType) => {
    if (isActive) {
      sessionManager.updateActivity(sessionId, section);
    }
  }, [isActive, sessionManager, sessionId]);

  // Update terminal size function
  const updateTerminalSize = useCallback((size: TerminalDimensions) => {
    if (isActive) {
      sessionManager.updateTerminalSize(sessionId, size);
    }
  }, [isActive, sessionManager, sessionId]);

  // End session function
  const endSession = useCallback((reason: string = 'manual') => {
    if (isActive) {
      sessionManager.endSession(sessionId, reason as any);
      setIsActive(false);
    }
  }, [isActive, sessionManager, sessionId]);

  return {
    sessionId,
    sessionInfo,
    updateActivity,
    updateTerminalSize,
    endSession,
    isActive
  };
}

/**
 * Hook for session statistics (useful for debugging/monitoring)
 */
export function useSessionStats() {
  const sessionManager = getSessionManager();
  const [stats, setStats] = useState(() => sessionManager.getStats());

  useEffect(() => {
    const updateStats = () => {
      setStats(sessionManager.getStats());
    };

    // Update stats on session events
    sessionManager.on('sessionCreated', updateStats);
    sessionManager.on('sessionEnded', updateStats);
    sessionManager.on('sessionActivity', updateStats);

    // Periodic updates
    const interval = setInterval(updateStats, 10000); // Update every 10 seconds

    return () => {
      clearInterval(interval);
      sessionManager.off('sessionCreated', updateStats);
      sessionManager.off('sessionEnded', updateStats);
      sessionManager.off('sessionActivity', updateStats);
    };
  }, [sessionManager]);

  return stats;
}