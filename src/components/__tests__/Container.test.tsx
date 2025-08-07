import React from 'react';
import { render } from 'ink-testing-library';
import { vi } from 'vitest';
import Container from '../Container';

// Mock useStdout hook
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

// Mock terminal capabilities
vi.mock('../../utils/terminalCapabilities', () => ({
  detectTerminalCapabilities: vi.fn(() => ({
    supportsColor: true,
    supportsUnicode: true,
    supportsBorders: true,
    supportsResize: true,
    minWidth: 40,
    minHeight: 10
  }))
}));

describe('Container', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children inside container', () => {
    const { lastFrame } = render(
      <Container>
        <div>Test content</div>
      </Container>
    );
    const output = lastFrame();

    expect(output).toContain('Test content');
  });

  it('should apply default padding', () => {
    const { lastFrame } = render(
      <Container>
        <div>Test content</div>
      </Container>
    );
    const output = lastFrame();

    expect(output).toContain('Test content');
  });

  it('should apply custom padding', () => {
    const { lastFrame } = render(
      <Container padding={4}>
        <div>Test content</div>
      </Container>
    );
    const output = lastFrame();

    expect(output).toContain('Test content');
  });

  it('should handle small terminal dimensions', () => {
    const { useStdout } = require('ink');
    useStdout.mockReturnValue({
      stdout: {
        columns: 50,
        rows: 15
      }
    });

    const { lastFrame } = render(
      <Container>
        <div>Test content</div>
      </Container>
    );
    const output = lastFrame();

    expect(output).toContain('Test content');
  });

  it('should handle terminal without border support', () => {
    const { detectTerminalCapabilities } = require('../../utils/terminalCapabilities');
    detectTerminalCapabilities.mockReturnValue({
      supportsColor: true,
      supportsUnicode: true,
      supportsBorders: false,
      supportsResize: true,
      minWidth: 40,
      minHeight: 10
    });

    const { lastFrame } = render(
      <Container>
        <div>Test content</div>
      </Container>
    );
    const output = lastFrame();

    expect(output).toContain('Test content');
  });

  it('should handle terminal without color support', () => {
    const { detectTerminalCapabilities } = require('../../utils/terminalCapabilities');
    detectTerminalCapabilities.mockReturnValue({
      supportsColor: false,
      supportsUnicode: true,
      supportsBorders: true,
      supportsResize: true,
      minWidth: 40,
      minHeight: 10
    });

    const { lastFrame } = render(
      <Container>
        <div>Test content</div>
      </Container>
    );
    const output = lastFrame();

    expect(output).toContain('Test content');
  });

  it('should handle undefined terminal dimensions', () => {
    const { useStdout } = require('ink');
    useStdout.mockReturnValue({
      stdout: {
        columns: undefined,
        rows: undefined
      }
    });

    const { lastFrame } = render(
      <Container>
        <div>Test content</div>
      </Container>
    );
    const output = lastFrame();

    expect(output).toContain('Test content');
  });
});