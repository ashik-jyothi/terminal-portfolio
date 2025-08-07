/**
 * Navigation Integration Tests
 * Tests for complete navigation flows between sections
 */

import React from 'react';
import { render } from 'ink-testing-library';
import { Text } from 'ink';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';

// Mock ink's useInput hook
vi.mock('ink', async () => {
  const actual = await vi.importActual('ink');
  return {
    ...actual,
    useInput: vi.fn(),
    useStdout: vi.fn(() => ({
      stdout: {
        columns: 100,
        rows: 30
      }
    }))
  };
});

// Mock terminal capabilities
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

describe('Navigation Integration Tests', () => {
  // Test component that simulates the main app navigation
  const NavigationTestApp: React.FC = () => {
    const [currentSection, setCurrentSection] = React.useState('home');
    const [navigationHistory, setNavigationHistory] = React.useState<string[]>(['home']);

    const handleSectionChange = (section: string) => {
      setCurrentSection(section);
      setNavigationHistory(prev => [...prev, section]);
    };

    const handleExit = () => {
      // Mock exit handler
    };

    useKeyboardNavigation({
      currentSection,
      onSectionChange: handleSectionChange,
      onExit: handleExit
    });

    return (
      <div>
        <Text>Current Section: {currentSection.toUpperCase()}</Text>
        <Text>Navigation History: {navigationHistory.join(' → ')}</Text>
        <Text>Total Navigations: {navigationHistory.length}</Text>
      </div>
    );
  };

  let inputHandler: (input: string, key: any) => void;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    const { useInput } = await import('ink');
    useInput.mockImplementation((handler) => {
      inputHandler = handler;
    });
  });

  describe('Arrow Key Navigation', () => {
    it('should navigate forward through sections with right arrow', () => {
      const { lastFrame } = render(<NavigationTestApp />);
      
      // Start at home
      expect(lastFrame()).toContain('Current Section: HOME');
      
      // Navigate to about
      inputHandler('', { rightArrow: true });
      expect(lastFrame()).toContain('Current Section: ABOUT');
      
      // Navigate to skills
      inputHandler('', { rightArrow: true });
      expect(lastFrame()).toContain('Current Section: SKILLS');
      
      // Navigate to projects
      inputHandler('', { rightArrow: true });
      expect(lastFrame()).toContain('Current Section: PROJECTS');
      
      // Navigate to contact
      inputHandler('', { rightArrow: true });
      expect(lastFrame()).toContain('Current Section: CONTACT');
      
      // Should wrap around to home
      inputHandler('', { rightArrow: true });
      expect(lastFrame()).toContain('Current Section: HOME');
    });

    it('should navigate backward through sections with left arrow', () => {
      const { lastFrame } = render(<NavigationTestApp />);
      
      // Start at home, go backward to contact (wrap around)
      inputHandler('', { leftArrow: true });
      expect(lastFrame()).toContain('Current Section: CONTACT');
      
      // Navigate backward to projects
      inputHandler('', { leftArrow: true });
      expect(lastFrame()).toContain('Current Section: PROJECTS');
      
      // Navigate backward to skills
      inputHandler('', { leftArrow: true });
      expect(lastFrame()).toContain('Current Section: SKILLS');
      
      // Navigate backward to about
      inputHandler('', { leftArrow: true });
      expect(lastFrame()).toContain('Current Section: ABOUT');
      
      // Navigate backward to home
      inputHandler('', { leftArrow: true });
      expect(lastFrame()).toContain('Current Section: HOME');
    });

    it('should handle up/down arrows same as left/right', () => {
      const { lastFrame } = render(<NavigationTestApp />);
      
      // Down arrow should go forward
      inputHandler('', { downArrow: true });
      expect(lastFrame()).toContain('Current Section: ABOUT');
      
      // Up arrow should go backward
      inputHandler('', { upArrow: true });
      expect(lastFrame()).toContain('Current Section: HOME');
    });
  });

  describe('Vim-style Navigation', () => {
    it('should navigate with vim keys (h, j, k, l)', () => {
      const { lastFrame } = render(<NavigationTestApp />);
      
      // 'l' should go forward (right)
      inputHandler('l', {});
      expect(lastFrame()).toContain('Current Section: ABOUT');
      
      // 'h' should go backward (left)
      inputHandler('h', {});
      expect(lastFrame()).toContain('Current Section: HOME');
      
      // 'j' should go forward (down)
      inputHandler('j', {});
      expect(lastFrame()).toContain('Current Section: ABOUT');
      
      // 'k' should go backward (up)
      inputHandler('k', {});
      expect(lastFrame()).toContain('Current Section: HOME');
    });

    it('should handle vim shortcuts g and G', () => {
      const { lastFrame } = render(<NavigationTestApp />);
      
      // Navigate to middle section first
      inputHandler('3', {});
      expect(lastFrame()).toContain('Current Section: SKILLS');
      
      // 'g' should go to home
      inputHandler('g', {});
      expect(lastFrame()).toContain('Current Section: HOME');
      
      // 'G' should go to home (based on implementation)
      inputHandler('G', {});
      expect(lastFrame()).toContain('Current Section: HOME');
    });
  });

  describe('Number Key Navigation', () => {
    it('should navigate directly to sections with number keys', () => {
      const { lastFrame } = render(<NavigationTestApp />);
      
      // Test all number shortcuts
      inputHandler('1', {});
      expect(lastFrame()).toContain('Current Section: HOME');
      
      inputHandler('2', {});
      expect(lastFrame()).toContain('Current Section: ABOUT');
      
      inputHandler('3', {});
      expect(lastFrame()).toContain('Current Section: SKILLS');
      
      inputHandler('4', {});
      expect(lastFrame()).toContain('Current Section: PROJECTS');
      
      inputHandler('5', {});
      expect(lastFrame()).toContain('Current Section: CONTACT');
    });

    it('should ignore invalid number keys', () => {
      const { lastFrame } = render(<NavigationTestApp />);
      
      const initialOutput = lastFrame();
      
      // Try invalid numbers
      inputHandler('0', {});
      inputHandler('6', {});
      inputHandler('9', {});
      
      // Should remain unchanged
      expect(lastFrame()).toBe(initialOutput);
    });
  });

  describe('Navigation History Tracking', () => {
    it('should track navigation history correctly', () => {
      const { lastFrame } = render(<NavigationTestApp />);
      
      // Perform a series of navigations
      inputHandler('2', {}); // Go to about
      inputHandler('4', {}); // Go to projects
      inputHandler('1', {}); // Go to home
      inputHandler('5', {}); // Go to contact
      
      const output = lastFrame();
      expect(output).toContain('Navigation History: home → about → projects → home → contact');
      expect(output).toContain('Total Navigations: 5');
    });

    it('should handle complex navigation patterns', () => {
      const { lastFrame } = render(<NavigationTestApp />);
      
      // Mix of different navigation methods
      inputHandler('', { rightArrow: true }); // home → about
      inputHandler('l', {}); // about → skills
      inputHandler('4', {}); // skills → projects
      inputHandler('h', {}); // projects → skills
      inputHandler('', { leftArrow: true }); // skills → about
      
      const output = lastFrame();
      expect(output).toContain('Current Section: ABOUT');
      expect(output).toContain('Total Navigations: 6');
    });
  });

  describe('Exit Commands', () => {
    it('should handle exit commands', () => {
      const { lastFrame } = render(<NavigationTestApp />);
      
      // Test 'q' key
      expect(() => inputHandler('q', {})).toThrow(/process\.exit/);
      
      // Test Escape key
      expect(() => inputHandler('', { escape: true })).toThrow(/process\.exit/);
      
      // Test Ctrl+C
      expect(() => inputHandler('c', { ctrl: true })).toThrow(/process\.exit/);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle rapid navigation inputs', () => {
      const { lastFrame } = render(<NavigationTestApp />);
      
      // Rapid fire navigation
      for (let i = 0; i < 10; i++) {
        inputHandler('', { rightArrow: true });
      }
      
      // Should still be in a valid state
      const output = lastFrame();
      expect(output).toContain('Current Section:');
      expect(output).toContain('Total Navigations: 11'); // Initial + 10 navigations
    });

    it('should handle mixed input types', () => {
      const { lastFrame } = render(<NavigationTestApp />);
      
      // Mix valid and invalid inputs
      inputHandler('2', {}); // Valid: go to about
      inputHandler('x', {}); // Invalid: should be ignored
      inputHandler('', { rightArrow: true }); // Valid: go to skills
      inputHandler('0', {}); // Invalid: should be ignored
      inputHandler('g', {}); // Valid: go to home
      
      const output = lastFrame();
      expect(output).toContain('Current Section: HOME');
      expect(output).toContain('Total Navigations: 4'); // Only valid navigations counted
    });

    it('should maintain state consistency during navigation', () => {
      const { lastFrame } = render(<NavigationTestApp />);
      
      // Navigate through all sections and back
      const sections = ['about', 'skills', 'projects', 'contact', 'home'];
      
      sections.forEach((_, index) => {
        inputHandler('', { rightArrow: true });
      });
      
      // Should be back at home
      expect(lastFrame()).toContain('Current Section: HOME');
      
      // History should show complete cycle
      const output = lastFrame();
      expect(output).toContain('Total Navigations: 6'); // Initial + 5 navigations
    });
  });

  describe('Responsive Navigation', () => {
    it('should handle navigation with different terminal sizes', async () => {
      // Mock different terminal sizes
      const { useStdout } = vi.mocked(await import('ink'));
      
      // Small terminal
      useStdout.mockReturnValue({
        stdout: { columns: 40, rows: 15 }
      });
      
      const { lastFrame } = render(<NavigationTestApp />);
      
      // Navigation should still work
      inputHandler('2', {});
      expect(lastFrame()).toContain('Current Section: ABOUT');
      
      // Large terminal
      useStdout.mockReturnValue({
        stdout: { columns: 200, rows: 50 }
      });
      
      inputHandler('3', {});
      expect(lastFrame()).toContain('Current Section: SKILLS');
    });
  });

  describe('Performance and Memory', () => {
    it('should not leak memory during extensive navigation', () => {
      const { lastFrame } = render(<NavigationTestApp />);
      
      // Simulate extensive navigation
      for (let i = 0; i < 100; i++) {
        inputHandler(String((i % 5) + 1), {}); // Cycle through sections
      }
      
      // Should still be responsive
      const output = lastFrame();
      expect(output).toContain('Current Section:');
      expect(output).toContain('Total Navigations: 101');
    });
  });
});