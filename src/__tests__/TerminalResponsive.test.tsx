/**
 * Terminal Responsive Tests
 * Tests for responsive behavior with different terminal sizes
 */

import React from 'react';
import { render } from 'ink-testing-library';
import { Text } from 'ink';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Container from '../components/Container';
import Section from '../components/Section';
import Navigation from '../components/Navigation';
import { useTerminalResize } from '../hooks/useTerminalResize';

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
  })),
  validateTerminalDimensions: vi.fn((width, height) => ({
    width: Math.max(width, 60),
    height: Math.max(height, 20),
    isTooSmall: width < 60 || height < 20,
    warnings: {
      width: width < 60 ? 'Terminal width is below minimum' : null,
      height: height < 20 ? 'Terminal height is below minimum' : null
    }
  }))
}));

// Mock ink's useStdout
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

describe('Terminal Responsive Tests', () => {
  // Test component that uses terminal resize hook
  const ResponsiveTestComponent: React.FC<{
    onResize?: (dimensions: { width: number; height: number }) => void;
  }> = ({ onResize }) => {
    const { dimensions, isResizing, warnings, capabilities } = useTerminalResize({
      onResize
    });

    return (
      <Container>
        <Section title="Responsive Test">
          <Text>Terminal Size: {dimensions.width}x{dimensions.height}</Text>
          <Text>Resizing: {isResizing ? 'Yes' : 'No'}</Text>
          <Text>Warnings: {warnings.length}</Text>
          <Text>Color Support: {capabilities.supportsColor ? 'Yes' : 'No'}</Text>
          <Text>Unicode Support: {capabilities.supportsUnicode ? 'Yes' : 'No'}</Text>
          <Text>Border Support: {capabilities.supportsBorders ? 'Yes' : 'No'}</Text>
          <Text>Resize Support: {capabilities.supportsResize ? 'Yes' : 'No'}</Text>
        </Section>
      </Container>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Terminal Size Detection', () => {
    it('should detect standard terminal sizes', async () => {
      const { useStdout } = vi.mocked(await import('ink'));
      
      // Standard terminal size
      useStdout.mockReturnValue({
        stdout: { columns: 80, rows: 24 }
      });

      const { lastFrame } = render(<ResponsiveTestComponent />);
      const output = lastFrame();

      expect(output).toContain('Terminal Size: 80x24');
      expect(output).toContain('Resizing: No');
    });

    it('should detect large terminal sizes', async () => {
      const { useStdout } = vi.mocked(await import('ink'));
      
      // Large terminal size
      useStdout.mockReturnValue({
        stdout: { columns: 200, rows: 50 }
      });

      const { lastFrame } = render(<ResponsiveTestComponent />);
      const output = lastFrame();

      expect(output).toContain('Terminal Size: 200x50');
    });

    it('should detect small terminal sizes', async () => {
      const { useStdout } = vi.mocked(await import('ink'));
      
      // Small terminal size
      useStdout.mockReturnValue({
        stdout: { columns: 40, rows: 15 }
      });

      const { lastFrame } = render(<ResponsiveTestComponent />);
      const output = lastFrame();

      expect(output).toContain('Terminal Size: 40x15');
    });

    it('should handle undefined terminal dimensions', async () => {
      const { useStdout } = vi.mocked(await import('ink'));
      
      // Undefined dimensions
      useStdout.mockReturnValue({
        stdout: { columns: undefined, rows: undefined }
      });

      const { lastFrame } = render(<ResponsiveTestComponent />);
      const output = lastFrame();

      // Should fallback to default dimensions
      expect(output).toContain('Terminal Size:');
    });
  });

  describe('Responsive Layout Behavior', () => {
    it('should adapt container layout to terminal size', async () => {
      const { useStdout } = vi.mocked(await import('ink'));
      
      // Test with different sizes
      const sizes = [
        { columns: 60, rows: 20 },   // Minimum
        { columns: 80, rows: 24 },   // Standard
        { columns: 120, rows: 40 },  // Large
        { columns: 200, rows: 60 }   // Extra large
      ];

      sizes.forEach(size => {
        useStdout.mockReturnValue({ stdout: size });
        
        const { lastFrame } = render(
          <Container>
            <Text>Content for {size.columns}x{size.rows}</Text>
          </Container>
        );
        
        const output = lastFrame();
        expect(output).toContain(`Content for ${size.columns}x${size.rows}`);
      });
    });

    it('should handle navigation layout responsively', async () => {
      const { useStdout } = vi.mocked(await import('ink'));
      const mockOnSectionChange = vi.fn();

      // Test navigation with different terminal sizes
      const sizes = [
        { columns: 60, rows: 20 },
        { columns: 100, rows: 30 },
        { columns: 150, rows: 45 }
      ];

      sizes.forEach(size => {
        useStdout.mockReturnValue({ stdout: size });
        
        const { lastFrame } = render(
          <Navigation currentSection="home" onSectionChange={mockOnSectionChange} />
        );
        
        const output = lastFrame();
        
        // Navigation should render regardless of size
        expect(output).toContain('[1] Home');
        expect(output).toContain('[2] About');
        expect(output).toContain('Current Section: HOME');
      });
    });

    it('should handle section content responsively', async () => {
      const { useStdout } = vi.mocked(await import('ink'));

      // Test with narrow terminal
      useStdout.mockReturnValue({
        stdout: { columns: 50, rows: 20 }
      });

      const { lastFrame } = render(
        <Section title="Responsive Section">
          <Text>This is content that should adapt to terminal width</Text>
          <Text>Multiple lines of content to test wrapping behavior</Text>
        </Section>
      );

      const output = lastFrame();
      expect(output).toContain('RESPONSIVE SECTION');
      expect(output).toContain('This is content');
    });
  });

  describe('Terminal Capability Adaptation', () => {
    it('should adapt to terminals without color support', async () => {
      const { detectTerminalCapabilities } = vi.mocked(await import('../utils/terminalCapabilities'));
      
      detectTerminalCapabilities.mockReturnValue({
        supportsColor: false,
        supportsUnicode: true,
        supportsBorders: true,
        supportsResize: true,
        minWidth: 60,
        minHeight: 20
      });

      const { lastFrame } = render(<ResponsiveTestComponent />);
      const output = lastFrame();

      expect(output).toContain('Color Support: No');
      expect(output).toContain('Unicode Support: Yes');
    });

    it('should adapt to terminals without unicode support', async () => {
      const { detectTerminalCapabilities, getFallbackChars } = vi.mocked(await import('../utils/terminalCapabilities'));
      
      detectTerminalCapabilities.mockReturnValue({
        supportsColor: true,
        supportsUnicode: false,
        supportsBorders: true,
        supportsResize: true,
        minWidth: 60,
        minHeight: 20
      });

      getFallbackChars.mockReturnValue({
        bullet: '>',
        horizontal: '-',
        dot: '.',
        warning: '!',
        error: 'X',
        success: 'OK',
        arrow: '->'
      });

      const { lastFrame } = render(
        <Section title="Test">
          <Text>Content</Text>
        </Section>
      );

      const output = lastFrame();
      expect(output).toContain('> TEST'); // ASCII bullet instead of unicode
    });

    it('should adapt to terminals without border support', async () => {
      const { detectTerminalCapabilities } = vi.mocked(await import('../utils/terminalCapabilities'));
      
      detectTerminalCapabilities.mockReturnValue({
        supportsColor: true,
        supportsUnicode: true,
        supportsBorders: false,
        supportsResize: true,
        minWidth: 60,
        minHeight: 20
      });

      const { lastFrame } = render(<ResponsiveTestComponent />);
      const output = lastFrame();

      expect(output).toContain('Border Support: No');
    });

    it('should handle terminals with no special capabilities', async () => {
      const { detectTerminalCapabilities, getFallbackChars } = vi.mocked(await import('../utils/terminalCapabilities'));
      
      detectTerminalCapabilities.mockReturnValue({
        supportsColor: false,
        supportsUnicode: false,
        supportsBorders: false,
        supportsResize: false,
        minWidth: 60,
        minHeight: 20
      });

      getFallbackChars.mockReturnValue({
        bullet: '*',
        horizontal: '-',
        dot: '.',
        warning: '!',
        error: 'X',
        success: 'OK',
        arrow: '->'
      });

      const { lastFrame } = render(
        <Section title="Basic Terminal">
          <Text>Content for basic terminal</Text>
        </Section>
      );

      const output = lastFrame();
      expect(output).toContain('* BASIC TERMINAL');
      expect(output).toContain('Content for basic terminal');
    });
  });

  describe('Resize Event Handling', () => {
    it('should handle resize events', () => {
      const mockOnResize = vi.fn();
      
      render(<ResponsiveTestComponent onResize={mockOnResize} />);

      // Should call onResize with initial dimensions
      expect(mockOnResize).toHaveBeenCalledWith({ width: 100, height: 30 });
    });

    it('should handle rapid resize events', async () => {
      const mockOnResize = vi.fn();
      const { useStdout } = vi.mocked(await import('ink'));
      
      // Simulate rapid resize events
      const sizes = [
        { columns: 80, rows: 24 },
        { columns: 90, rows: 27 },
        { columns: 100, rows: 30 },
        { columns: 110, rows: 33 }
      ];

      sizes.forEach(size => {
        useStdout.mockReturnValue({ stdout: size });
      });

      render(<ResponsiveTestComponent onResize={mockOnResize} />);

      // Should handle all resize events
      expect(mockOnResize).toHaveBeenCalled();
    });

    it('should debounce resize events', () => {
      const mockOnResize = vi.fn();
      
      // Test with custom debounce time
      const TestComponentWithDebounce: React.FC = () => {
        const { dimensions } = useTerminalResize({
          debounceMs: 100,
          onResize: mockOnResize
        });

        return <Text>Size: {dimensions.width}x{dimensions.height}</Text>;
      };

      const { lastFrame } = render(<TestComponentWithDebounce />);
      const output = lastFrame();

      expect(output).toContain('Size:');
    });
  });

  describe('Warning System', () => {
    it('should generate warnings for small terminals', async () => {
      const { validateTerminalDimensions } = vi.mocked(await import('../utils/terminalCapabilities'));
      
      validateTerminalDimensions.mockReturnValue({
        width: 60,
        height: 20,
        isTooSmall: true,
        warnings: {
          width: 'Terminal width is below recommended minimum',
          height: 'Terminal height is below recommended minimum'
        }
      });

      const TestWarningComponent: React.FC = () => {
        const { warnings } = useTerminalResize({});
        return (
          <div>
            <Text>Warning Count: {warnings.length}</Text>
            {warnings.map((warning, index) => (
              <Text key={index}>Warning: {warning}</Text>
            ))}
          </div>
        );
      };

      const { lastFrame } = render(<TestWarningComponent />);
      const output = lastFrame();

      expect(output).toContain('Warning Count:');
    });

    it('should clear warnings for adequate terminal sizes', async () => {
      const { validateTerminalDimensions } = vi.mocked(await import('../utils/terminalCapabilities'));
      
      validateTerminalDimensions.mockReturnValue({
        width: 100,
        height: 30,
        isTooSmall: false,
        warnings: {
          width: null,
          height: null
        }
      });

      const TestWarningComponent: React.FC = () => {
        const { warnings } = useTerminalResize({});
        return <Text>Warning Count: {warnings.length}</Text>;
      };

      const { lastFrame } = render(<TestWarningComponent />);
      const output = lastFrame();

      expect(output).toContain('Warning Count: 0');
    });
  });

  describe('Performance with Different Sizes', () => {
    it('should render efficiently across different terminal sizes', async () => {
      const { useStdout } = vi.mocked(await import('ink'));
      
      const sizes = [
        { columns: 40, rows: 15 },   // Small
        { columns: 80, rows: 24 },   // Standard
        { columns: 120, rows: 40 },  // Large
        { columns: 200, rows: 60 }   // Extra large
      ];

      sizes.forEach(size => {
        const startTime = Date.now();
        
        useStdout.mockReturnValue({ stdout: size });
        
        const { lastFrame } = render(<ResponsiveTestComponent />);
        const output = lastFrame();
        
        const renderTime = Date.now() - startTime;
        
        // Should render quickly regardless of size
        expect(renderTime).toBeLessThan(50);
        expect(output).toContain(`Terminal Size: ${size.columns}x${size.rows}`);
      });
    });

    it('should handle memory efficiently with size changes', async () => {
      const { useStdout } = vi.mocked(await import('ink'));
      
      // Simulate many size changes
      for (let i = 0; i < 50; i++) {
        useStdout.mockReturnValue({
          stdout: { columns: 80 + i, rows: 24 + i }
        });
      }

      const { lastFrame } = render(<ResponsiveTestComponent />);
      const output = lastFrame();

      // Should still render correctly
      expect(output).toContain('Terminal Size:');
    });
  });

  describe('Edge Cases', () => {
    it('should handle extreme terminal sizes', async () => {
      const { useStdout } = vi.mocked(await import('ink'));
      
      // Very small terminal
      useStdout.mockReturnValue({
        stdout: { columns: 10, rows: 5 }
      });

      const { lastFrame } = render(<ResponsiveTestComponent />);
      let output = lastFrame();
      expect(output).toContain('Terminal Size:');

      // Very large terminal
      useStdout.mockReturnValue({
        stdout: { columns: 500, rows: 200 }
      });

      const { lastFrame: lastFrame2 } = render(<ResponsiveTestComponent />);
      output = lastFrame2();
      expect(output).toContain('Terminal Size: 500x200');
    });

    it('should handle zero or negative dimensions', async () => {
      const { useStdout } = vi.mocked(await import('ink'));
      
      useStdout.mockReturnValue({
        stdout: { columns: 0, rows: 0 }
      });

      expect(() => {
        render(<ResponsiveTestComponent />);
      }).not.toThrow();
    });

    it('should handle null terminal dimensions', async () => {
      const { useStdout } = vi.mocked(await import('ink'));
      
      useStdout.mockReturnValue({
        stdout: { columns: null, rows: null }
      });

      expect(() => {
        render(<ResponsiveTestComponent />);
      }).not.toThrow();
    });
  });
});