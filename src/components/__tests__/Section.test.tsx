import React from 'react';
import { render } from 'ink-testing-library';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Text } from 'ink';
import Section from '../Section';

// Mock terminal capabilities
vi.mock('../../utils/terminalCapabilities', () => ({
  detectTerminalCapabilities: vi.fn(() => ({
    supportsColor: true,
    supportsUnicode: true,
    supportsBorders: true,
    supportsResize: true
  })),
  getFallbackChars: vi.fn(() => ({
    bullet: '•',
    horizontal: '─',
    dot: '·'
  }))
}));

describe('Section', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render section with title', () => {
    const { lastFrame } = render(
      <Section title="Test Section">
        <Text>Test content</Text>
      </Section>
    );
    const output = lastFrame();

    expect(output).toContain('• TEST SECTION');
    expect(output).toContain('Test content');
  });

  it('should display decorative underline', () => {
    const { lastFrame } = render(
      <Section title="About">
        <Text>Content</Text>
      </Section>
    );
    const output = lastFrame();

    expect(output).toContain('─'.repeat(7)); // "About" + 2 = 7 characters
  });

  it('should display bottom spacing with dots', () => {
    const { lastFrame } = render(
      <Section title="Skills">
        <Text>Content</Text>
      </Section>
    );
    const output = lastFrame();

    expect(output).toContain('·'.repeat(40));
  });

  it('should handle long titles', () => {
    const longTitle = 'This is a very long section title that exceeds normal length';
    const { lastFrame } = render(
      <Section title={longTitle}>
        <Text>Content</Text>
      </Section>
    );
    const output = lastFrame();

    expect(output).toContain(`• ${longTitle.toUpperCase()}`);
    expect(output).toContain('─'.repeat(50)); // Should be capped at 50
  });

  it('should handle terminal without color support', () => {
    const { detectTerminalCapabilities } = vi.mocked(await import('../../utils/terminalCapabilities'));
    detectTerminalCapabilities.mockReturnValue({
      supportsColor: false,
      supportsUnicode: true,
      supportsBorders: true,
      supportsResize: true
    });

    const { lastFrame } = render(
      <Section title="Test">
        <Text>Content</Text>
      </Section>
    );
    const output = lastFrame();

    expect(output).toContain('• TEST');
    expect(output).toContain('Content');
  });

  it('should handle terminal without unicode support', () => {
    const { getFallbackChars } = vi.mocked(await import('../../utils/terminalCapabilities'));
    getFallbackChars.mockReturnValue({
      bullet: '*',
      horizontal: '-',
      dot: '.'
    });

    const { lastFrame } = render(
      <Section title="Test">
        <Text>Content</Text>
      </Section>
    );
    const output = lastFrame();

    expect(output).toContain('* TEST');
    expect(output).toContain('-'.repeat(6)); // "Test" + 2 = 6
    expect(output).toContain('.'.repeat(40));
  });

  it('should render children with proper indentation', () => {
    const { lastFrame } = render(
      <Section title="Test">
        <Text>Line 1</Text>
        <Text>Line 2</Text>
      </Section>
    );
    const output = lastFrame();

    expect(output).toContain('Line 1');
    expect(output).toContain('Line 2');
  });

  it('should handle empty title', () => {
    const { lastFrame } = render(
      <Section title="">
        <Text>Content</Text>
      </Section>
    );
    const output = lastFrame();

    expect(output).toContain('• ');
    expect(output).toContain('Content');
  });
});