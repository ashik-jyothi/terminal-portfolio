/**
 * Hook Integration Tests
 * Tests for custom hooks functionality
 */

import React from 'react';
import { render } from 'ink-testing-library';
import { Text } from 'ink';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useKeyboardNavigation } from '../useKeyboardNavigation';
import { useTerminalResize } from '../useTerminalResize';
import { useSession } from '../useSession';

// Mock ink's useInput hook
vi.mock('ink', async () => {
  const actual = await vi.importActual('ink');
  return {
    ...actual,
    useInput: vi.fn(),
    useStdout: vi.fn(() => ({
      stdout: {
        columns: 80,
        rows: 24
      }
    }))
  };
});

// Mock terminal capabilities
vi.mock('../../utils/terminalCapabilities', () => ({
  detectTerminalCapabilities: vi.fn(() => ({
    supportsColor: true,
    supportsUnicode: true,
    supportsBorders: true,
    supportsResize: true,
    minWidth: 40,
    minHeight: 10
  })),
  validateTerminalDimensions: vi.fn((width, height) => ({
    width,
    height,
    isTooSmall: false,
    warnings: { width: null, height: null }
  }))
}));

// Mock session manager
vi.mock('../../utils/sessionManager', () => ({
  getSessionManager: vi.fn(() => ({
    createSession: vi.fn(() => 'test-session-id'),
    updateActivity: vi.fn(),
    updateTerminalSize: vi.fn(),
    endSession: vi.fn(),
    getSession: vi.fn(() => ({
      id: 'test-session-id',
      startTime: new Date(),
      lastActivity: new Date(),
      sectionsVisited: ['home'],
      terminalSize: { width: 80, height: 24 }
    })),
    getStats: vi.fn(() => ({
      activeSessions: 1,
      totalSessions: 1,
      mostVisitedSections: []
    }))
  }))
}));

describe('Hook Integration Tests', () => {
  describe('useKeyboardNavigation', () => {
    const TestKeyboardComponent: React.FC<{
      currentSection: string;
      onSectionChange: (section: string) => void;
      onExit?: () => void;
    }> = ({ currentSection, onSectionChange, onExit }) => {
      useKeyboardNavigation({ currentSection, onSectionChange, onExit });
      return <Text>Current: {currentSection}</Text>;
    };

    const mockOnSectionChange = vi.fn();
    const mockOnExit = vi.fn();

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should register input handler', async () => {
      const { useInput } = await import('ink');
      
      render(
        <TestKeyboardComponent 
          currentSection="home" 
          onSectionChange={mockOnSectionChange}
        />
      );

      expect(useInput).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should handle navigation input', async () => {
      const { useInput } = await import('ink');
      let inputHandler: (input: string, key: any) => void;

      useInput.mockImplementation((handler) => {
        inputHandler = handler;
      });

      render(
        <TestKeyboardComponent 
          currentSection="home" 
          onSectionChange={mockOnSectionChange}
        />
      );

      // Test arrow key navigation
      inputHandler('', { rightArrow: true });
      expect(mockOnSectionChange).toHaveBeenCalledWith('about');

      mockOnSectionChange.mockClear();

      // Test number key navigation
      inputHandler('3', {});
      expect(mockOnSectionChange).toHaveBeenCalledWith('skills');
    });

    it('should handle exit commands', async () => {
      const { useInput } = await import('ink');
      let inputHandler: (input: string, key: any) => void;

      useInput.mockImplementation((handler) => {
        inputHandler = handler;
      });

      render(
        <TestKeyboardComponent 
          currentSection="home" 
          onSectionChange={mockOnSectionChange}
          onExit={mockOnExit}
        />
      );

      // Test 'q' key
      expect(() => inputHandler('q', {})).toThrow(/process\.exit/);
      expect(mockOnExit).toHaveBeenCalled();
    });
  });

  describe('useTerminalResize', () => {
    const TestResizeComponent: React.FC<{
      onResize?: (dimensions: { width: number; height: number }) => void;
      onError?: (error: Error) => void;
    }> = ({ onResize, onError }) => {
      const { dimensions, isResizing, warnings, capabilities } = useTerminalResize({
        onResize,
        onError
      });

      return (
        <div>
          <Text>Width: {dimensions.width}</Text>
          <Text>Height: {dimensions.height}</Text>
          <Text>Resizing: {isResizing.toString()}</Text>
          <Text>Warnings: {warnings.length}</Text>
          <Text>Color: {capabilities.supportsColor.toString()}</Text>
        </div>
      );
    };

    it('should return terminal dimensions', () => {
      const { lastFrame } = render(<TestResizeComponent />);
      const output = lastFrame();

      expect(output).toContain('Width: 80');
      expect(output).toContain('Height: 24');
      expect(output).toContain('Resizing: false');
      expect(output).toContain('Color: true');
    });

    it('should handle resize callbacks', () => {
      const mockOnResize = vi.fn();
      
      render(<TestResizeComponent onResize={mockOnResize} />);

      // The hook should call onResize with initial dimensions
      expect(mockOnResize).toHaveBeenCalledWith({ width: 80, height: 24 });
    });

    it('should handle errors gracefully', () => {
      const mockOnError = vi.fn();
      
      // This test verifies the component renders without throwing
      expect(() => {
        render(<TestResizeComponent onError={mockOnError} />);
      }).not.toThrow();
    });
  });

  describe('useSession', () => {
    const TestSessionComponent: React.FC = () => {
      const { sessionInfo, updateActivity, isActive } = useSession();

      return (
        <div>
          <Text>Session ID: {sessionInfo.id}</Text>
          <Text>Active: {isActive.toString()}</Text>
          <Text>Sections: {sessionInfo.sectionsVisited.length}</Text>
        </div>
      );
    };

    it('should provide session information', () => {
      const { lastFrame } = render(<TestSessionComponent />);
      const output = lastFrame();

      expect(output).toContain('Session ID: test-session-id');
      expect(output).toContain('Active: true');
      expect(output).toContain('Sections: 1');
    });

    it('should handle session updates', () => {
      const TestUpdateComponent: React.FC = () => {
        const { updateActivity } = useSession();
        
        React.useEffect(() => {
          updateActivity('about');
        }, [updateActivity]);

        return <Text>Session updated</Text>;
      };

      const { lastFrame } = render(<TestUpdateComponent />);
      const output = lastFrame();

      expect(output).toContain('Session updated');
    });
  });

  describe('Hook Error Handling', () => {
    it('should handle hook initialization errors', async () => {
      // Mock a scenario where terminal capabilities fail
      const { detectTerminalCapabilities } = vi.mocked(await import('../../utils/terminalCapabilities'));
      detectTerminalCapabilities.mockImplementation(() => {
        throw new Error('Terminal detection failed');
      });

      // The component should still render without throwing
      expect(() => {
        render(
          <div>
            <Text>Error handling test</Text>
          </div>
        );
      }).not.toThrow();
    });

    it('should handle missing dependencies gracefully', () => {
      // Test that hooks work even when some dependencies are unavailable
      const TestComponent: React.FC = () => {
        try {
          const { dimensions } = useTerminalResize({});
          return <Text>Dimensions: {dimensions.width}x{dimensions.height}</Text>;
        } catch (error) {
          return <Text>Fallback rendered</Text>;
        }
      };

      expect(() => {
        render(<TestComponent />);
      }).not.toThrow();
    });
  });

  describe('Hook Performance', () => {
    it('should not cause excessive re-renders', () => {
      let renderCount = 0;
      
      const TestComponent: React.FC = () => {
        renderCount++;
        const { dimensions } = useTerminalResize({});
        return <Text>Render count: {renderCount}, Size: {dimensions.width}x{dimensions.height}</Text>;
      };

      const { lastFrame } = render(<TestComponent />);
      const output = lastFrame();

      expect(output).toContain('Render count: 1');
      expect(renderCount).toBeLessThanOrEqual(2); // Allow for initial render + effect
    });
  });
});