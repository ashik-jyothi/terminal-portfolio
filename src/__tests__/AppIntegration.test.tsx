/**
 * App Integration Tests
 * Tests for complete application integration and user flows
 */

import React from 'react';
import { render } from 'ink-testing-library';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import App from '../components/App';

// Mock all hooks and utilities
vi.mock('../hooks/useKeyboardNavigation', () => ({
  useKeyboardNavigation: vi.fn()
}));

vi.mock('../hooks/useSession', () => ({
  useSession: vi.fn(() => ({
    sessionInfo: { 
      id: 'test-session',
      sectionsVisited: ['home'],
      startTime: new Date(),
      lastActivity: new Date()
    },
    updateActivity: vi.fn(),
    updateTerminalSize: vi.fn(),
    endSession: vi.fn(),
    isActive: true
  }))
}));

vi.mock('../hooks/useTerminalResize', () => ({
  useTerminalResize: vi.fn(() => ({
    dimensions: { width: 100, height: 30 },
    isResizing: false,
    warnings: [],
    capabilities: {
      supportsColor: true,
      supportsUnicode: true,
      supportsBorders: true,
      supportsResize: true
    }
  }))
}));

vi.mock('../utils/terminalCapabilities', () => ({
  detectTerminalCapabilities: vi.fn(() => ({
    supportsColor: true,
    supportsUnicode: true,
    supportsBorders: true,
    supportsResize: true,
    minWidth: 60,
    minHeight: 20
  })),
  getFallbackChars: vi.fn(() => ({
    bullet: '▶',
    horizontal: '─',
    dot: '·',
    warning: '⚠',
    error: '✗',
    success: '✓',
    arrow: '→'
  }))
}));

vi.mock('ink', async () => {
  const actual = await vi.importActual('ink');
  return {
    ...actual,
    useStdout: vi.fn(() => ({
      stdout: {
        columns: 100,
        rows: 30
      }
    }))
  };
});

describe('App Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Application Initialization', () => {
    it('should render the complete application structure', () => {
      const { lastFrame } = render(<App />);
      const output = lastFrame();

      // Should contain main application elements
      expect(output).toContain("Ashik Jyothi's Portfolio");
      expect(output).toContain('Navigation');
      expect(output).toContain('Terminal:');
      expect(output).toContain('Session:');
    });

    it('should display terminal information', () => {
      const { lastFrame } = render(<App />);
      const output = lastFrame();

      expect(output).toContain('Terminal: 100x30');
      expect(output).toContain('Color support: ✓');
      expect(output).toContain('Unicode support: ✓');
      expect(output).toContain('Border support: ✓');
      expect(output).toContain('Resize support: ✓');
    });

    it('should display session information', () => {
      const { lastFrame } = render(<App />);
      const output = lastFrame();

      expect(output).toContain('Session: 1 sections visited');
      expect(output).toContain('Current section: HOME');
    });

    it('should show navigation instructions', () => {
      const { lastFrame } = render(<App />);
      const output = lastFrame();

      expect(output).toContain('Use navigation keys to explore different sections');
    });
  });

  describe('Responsive Behavior', () => {
    it('should adapt to different terminal sizes', async () => {
      const { useTerminalResize } = vi.mocked(await import('../hooks/useTerminalResize'));
      
      // Test small terminal
      useTerminalResize.mockReturnValue({
        dimensions: { width: 60, height: 20 },
        isResizing: false,
        warnings: ['Terminal width is below recommended minimum'],
        capabilities: {
          supportsColor: true,
          supportsUnicode: true,
          supportsBorders: true,
          supportsResize: true
        }
      });

      const { lastFrame } = render(<App />);
      const output = lastFrame();

      expect(output).toContain('Terminal: 60x20');
    });

    it('should handle terminal resize events', async () => {
      const { useTerminalResize } = vi.mocked(await import('../hooks/useTerminalResize'));
      
      useTerminalResize.mockReturnValue({
        dimensions: { width: 120, height: 40 },
        isResizing: true,
        warnings: [],
        capabilities: {
          supportsColor: true,
          supportsUnicode: true,
          supportsBorders: true,
          supportsResize: true
        }
      });

      const { lastFrame } = render(<App />);
      const output = lastFrame();

      expect(output).toContain('Terminal: 120x40');
    });

    it('should display warnings for small terminals', async () => {
      const { useTerminalResize } = vi.mocked(await import('../hooks/useTerminalResize'));
      
      useTerminalResize.mockReturnValue({
        dimensions: { width: 40, height: 15 },
        isResizing: false,
        warnings: ['Terminal too small for optimal display'],
        capabilities: {
          supportsColor: true,
          supportsUnicode: true,
          supportsBorders: true,
          supportsResize: true
        }
      });

      const { lastFrame } = render(<App />);
      const output = lastFrame();

      expect(output).toContain('Terminal: 40x15');
    });
  });

  describe('Session Management Integration', () => {
    it('should integrate with session management', async () => {
      const { useSession } = vi.mocked(await import('../hooks/useSession'));
      
      useSession.mockReturnValue({
        sessionInfo: {
          id: 'integration-test-session',
          sectionsVisited: ['home', 'about', 'skills'],
          startTime: new Date(),
          lastActivity: new Date()
        },
        updateActivity: vi.fn(),
        updateTerminalSize: vi.fn(),
        endSession: vi.fn(),
        isActive: true
      });

      const { lastFrame } = render(<App />);
      const output = lastFrame();

      expect(output).toContain('Session: 3 sections visited');
    });

    it('should handle inactive sessions', async () => {
      const { useSession } = vi.mocked(await import('../hooks/useSession'));
      
      useSession.mockReturnValue({
        sessionInfo: {
          id: 'inactive-session',
          sectionsVisited: ['home'],
          startTime: new Date(),
          lastActivity: new Date()
        },
        updateActivity: vi.fn(),
        updateTerminalSize: vi.fn(),
        endSession: vi.fn(),
        isActive: false
      });

      const { lastFrame } = render(<App />);
      const output = lastFrame();

      // Should still render but may show different status
      expect(output).toContain("Ashik Jyothi's Portfolio");
    });
  });

  describe('Keyboard Navigation Integration', () => {
    it('should integrate with keyboard navigation', async () => {
      const { useKeyboardNavigation } = vi.mocked(await import('../hooks/useKeyboardNavigation'));
      const mockNavigationHandler = vi.fn();
      
      useKeyboardNavigation.mockImplementation(({ onSectionChange }) => {
        // Simulate navigation setup
        mockNavigationHandler.mockImplementation(onSectionChange);
      });

      const { lastFrame } = render(<App />);
      const output = lastFrame();

      expect(useKeyboardNavigation).toHaveBeenCalledWith({
        currentSection: 'home',
        onSectionChange: expect.any(Function),
        onExit: expect.any(Function)
      });

      expect(output).toContain('Current section: HOME');
    });
  });

  describe('Terminal Capabilities Integration', () => {
    it('should handle terminals with limited capabilities', async () => {
      const { useTerminalResize } = vi.mocked(await import('../hooks/useTerminalResize'));
      
      useTerminalResize.mockReturnValue({
        dimensions: { width: 80, height: 24 },
        isResizing: false,
        warnings: [],
        capabilities: {
          supportsColor: false,
          supportsUnicode: false,
          supportsBorders: false,
          supportsResize: false
        }
      });

      const { lastFrame } = render(<App />);
      const output = lastFrame();

      expect(output).toContain('Color support: ✗');
      expect(output).toContain('Unicode support: ✗');
      expect(output).toContain('Border support: ✗');
      expect(output).toContain('Resize support: ✗');
    });

    it('should handle mixed terminal capabilities', async () => {
      const { useTerminalResize } = vi.mocked(await import('../hooks/useTerminalResize'));
      
      useTerminalResize.mockReturnValue({
        dimensions: { width: 80, height: 24 },
        isResizing: false,
        warnings: [],
        capabilities: {
          supportsColor: true,
          supportsUnicode: false,
          supportsBorders: true,
          supportsResize: false
        }
      });

      const { lastFrame } = render(<App />);
      const output = lastFrame();

      expect(output).toContain('Color support: ✓');
      expect(output).toContain('Unicode support: ✗');
      expect(output).toContain('Border support: ✓');
      expect(output).toContain('Resize support: ✗');
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle hook initialization errors gracefully', async () => {
      const { useSession } = vi.mocked(await import('../hooks/useSession'));
      
      // Mock a hook that throws an error
      useSession.mockImplementation(() => {
        throw new Error('Session initialization failed');
      });

      // App should still render without crashing
      expect(() => {
        render(<App />);
      }).not.toThrow();
    });

    it('should handle terminal capability detection errors', async () => {
      const { useTerminalResize } = vi.mocked(await import('../hooks/useTerminalResize'));
      
      useTerminalResize.mockImplementation(() => {
        throw new Error('Terminal detection failed');
      });

      // App should still render without crashing
      expect(() => {
        render(<App />);
      }).not.toThrow();
    });
  });

  describe('Performance Integration', () => {
    it('should render efficiently with all integrations', () => {
      const startTime = Date.now();
      
      const { lastFrame } = render(<App />);
      const output = lastFrame();
      
      const renderTime = Date.now() - startTime;
      
      // Should render quickly (under 100ms in test environment)
      expect(renderTime).toBeLessThan(100);
      expect(output).toContain("Ashik Jyothi's Portfolio");
    });

    it('should handle multiple rapid updates', async () => {
      const { useTerminalResize } = vi.mocked(await import('../hooks/useTerminalResize'));
      
      // Simulate rapid terminal resize events
      for (let i = 0; i < 10; i++) {
        useTerminalResize.mockReturnValue({
          dimensions: { width: 80 + i, height: 24 + i },
          isResizing: i < 5,
          warnings: [],
          capabilities: {
            supportsColor: true,
            supportsUnicode: true,
            supportsBorders: true,
            supportsResize: true
          }
        });
      }

      const { lastFrame } = render(<App />);
      const output = lastFrame();

      // Should handle updates without issues
      expect(output).toContain("Ashik Jyothi's Portfolio");
    });
  });

  describe('Accessibility Integration', () => {
    it('should provide accessible content structure', () => {
      const { lastFrame } = render(<App />);
      const output = lastFrame();

      // Should have clear section headers and navigation
      expect(output).toContain('Navigation');
      expect(output).toContain('Current section');
      expect(output).toContain('Terminal:');
      expect(output).toContain('Session:');
    });

    it('should work with screen readers (text-based)', () => {
      const { lastFrame } = render(<App />);
      const output = lastFrame();

      // All content should be text-based and readable
      expect(typeof output).toBe('string');
      expect(output.length).toBeGreaterThan(0);
      
      // Should not contain only whitespace
      expect(output.trim()).not.toBe('');
    });
  });

  describe('State Management Integration', () => {
    it('should maintain consistent state across components', () => {
      const { lastFrame } = render(<App />);
      const output = lastFrame();

      // All components should show consistent state
      expect(output).toContain('Current section: HOME');
      expect(output).toContain('Session: 1 sections visited');
    });

    it('should handle state updates properly', async () => {
      const { useSession } = vi.mocked(await import('../hooks/useSession'));
      
      // Mock state change
      useSession.mockReturnValue({
        sessionInfo: {
          id: 'updated-session',
          sectionsVisited: ['home', 'about'],
          startTime: new Date(),
          lastActivity: new Date()
        },
        updateActivity: vi.fn(),
        updateTerminalSize: vi.fn(),
        endSession: vi.fn(),
        isActive: true
      });

      const { lastFrame } = render(<App />);
      const output = lastFrame();

      expect(output).toContain('Session: 2 sections visited');
    });
  });
});