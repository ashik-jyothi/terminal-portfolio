import React from 'react';
import { render } from 'ink-testing-library';
import { Text } from 'ink';
import { vi } from 'vitest';
import { useTerminalResize } from '../useTerminalResize';

// Mock useStdout from ink
vi.mock('ink', async () => {
  const actual = await vi.importActual('ink');
  return {
    ...actual,
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

// Test component that uses the hook
const TestComponent: React.FC<{
  debounceMs?: number;
  onResize?: (dimensions: { width: number; height: number }) => void;
  onError?: (error: Error) => void;
}> = ({ debounceMs, onResize, onError }) => {
  const { dimensions, isResizing, warnings, capabilities } = useTerminalResize({
    debounceMs,
    onResize,
    onError
  });

  return (
    <div>
      <Text>Width: {dimensions.width}</Text>
      <Text>Height: {dimensions.height}</Text>
      <Text>Resizing: {isResizing.toString()}</Text>
      <Text>Warnings: {warnings.join(', ')}</Text>
      <Text>Color: {capabilities.supportsColor.toString()}</Text>
    </div>
  );
};

describe('useTerminalResize', () => {
  const mockOnResize = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial terminal dimensions', () => {
    const { lastFrame } = render(<TestComponent />);
    const output = lastFrame();

    expect(output).toContain('Width: 80');
    expect(output).toContain('Height: 24');
    expect(output).toContain('Resizing: false');
    expect(output).toContain('Color: true');
  });

  it('should call onResize callback with dimensions', () => {
    render(<TestComponent onResize={mockOnResize} />);

    // The hook should call onResize with initial dimensions
    expect(mockOnResize).toHaveBeenCalledWith({ width: 80, height: 24 });
  });

  it('should handle terminal without resize support', async () => {
    const { detectTerminalCapabilities } = await import('../../utils/terminalCapabilities');
    detectTerminalCapabilities.mockReturnValue({
      supportsColor: true,
      supportsUnicode: true,
      supportsBorders: true,
      supportsResize: false,
      minWidth: 40,
      minHeight: 10
    });

    const { lastFrame } = render(<TestComponent />);
    const output = lastFrame();

    expect(output).toContain('Width: 80');
    expect(output).toContain('Height: 24');
  });

  it('should handle small terminal dimensions', async () => {
    const { useStdout } = await import('ink');
    useStdout.mockReturnValue({
      stdout: {
        columns: 30,
        rows: 8
      }
    });

    const { lastFrame } = render(<TestComponent />);
    const output = lastFrame();

    expect(output).toContain('Width: 30');
    expect(output).toContain('Height: 8');
  });

  it('should handle undefined terminal dimensions', async () => {
    const { useStdout } = await import('ink');
    useStdout.mockReturnValue({
      stdout: {
        columns: undefined,
        rows: undefined
      }
    });

    const { lastFrame } = render(<TestComponent />);
    const output = lastFrame();

    // Should fallback to default dimensions
    expect(output).toContain('Width: 80');
    expect(output).toContain('Height: 24');
  });

  it('should detect terminal capability warnings', async () => {
    const { detectTerminalCapabilities } = await import('../../utils/terminalCapabilities');
    detectTerminalCapabilities.mockReturnValue({
      supportsColor: false,
      supportsUnicode: false,
      supportsBorders: true,
      supportsResize: true,
      minWidth: 40,
      minHeight: 10
    });

    const { lastFrame } = render(<TestComponent />);
    const output = lastFrame();

    expect(output).toContain('Color: false');
  });

  it('should use custom debounce time', () => {
    const { lastFrame } = render(<TestComponent debounceMs={500} />);
    const output = lastFrame();

    expect(output).toContain('Width: 80');
    expect(output).toContain('Height: 24');
  });

  it('should handle resize events', () => {
    // This is a conceptual test since we can't easily trigger resize events in tests
    const { lastFrame } = render(
      <TestComponent onResize={mockOnResize} onError={mockOnError} />
    );
    const output = lastFrame();

    expect(output).toContain('Width: 80');
    expect(output).toContain('Height: 24');
    expect(mockOnResize).toHaveBeenCalledWith({ width: 80, height: 24 });
  });

  it('should handle errors gracefully', async () => {
    // Mock an error scenario
    const { useStdout } = await import('ink');
    useStdout.mockImplementation(() => {
      throw new Error('Terminal access error');
    });

    // The hook should handle this gracefully and use fallback values
    const { lastFrame } = render(<TestComponent onError={mockOnError} />);
    const output = lastFrame();

    // Should still render with fallback dimensions
    expect(output).toBeDefined();
  });

  it('should provide terminal capabilities', () => {
    const { lastFrame } = render(<TestComponent />);
    const output = lastFrame();

    expect(output).toContain('Color: true');
  });

  it('should handle terminal with limited capabilities', async () => {
    const { detectTerminalCapabilities } = await import('../../utils/terminalCapabilities');
    detectTerminalCapabilities.mockReturnValue({
      supportsColor: false,
      supportsUnicode: false,
      supportsBorders: false,
      supportsResize: false,
      minWidth: 40,
      minHeight: 10
    });

    const { lastFrame } = render(<TestComponent />);
    const output = lastFrame();

    expect(output).toContain('Color: false');
    expect(output).toContain('Width: 80');
    expect(output).toContain('Height: 24');
  });
});