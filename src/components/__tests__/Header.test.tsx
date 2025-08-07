import React from 'react';
import { render } from 'ink-testing-library';
import Header from '../Header';

describe('Header', () => {
  it('should render with default title', () => {
    const { lastFrame } = render(<Header />);
    const output = lastFrame();

    expect(output).toContain('TERMINAL PORTFOLIO');
    expect(output).toContain('Full Stack Developer');
  });

  it('should render with custom title', () => {
    const { lastFrame } = render(<Header title="Custom Portfolio" />);
    const output = lastFrame();

    expect(output).toContain('CUSTOM PORTFOLIO');
    expect(output).toContain('Full Stack Developer');
  });

  it('should display ASCII art borders', () => {
    const { lastFrame } = render(<Header />);
    const output = lastFrame();

    expect(output).toContain('╔══════════════════════════════════════════════════════════╗');
    expect(output).toContain('╚══════════════════════════════════════════════════════════╝');
  });

  it('should display rocket emojis', () => {
    const { lastFrame } = render(<Header />);
    const output = lastFrame();

    expect(output).toContain('🚀');
  });

  it('should display decorative separator', () => {
    const { lastFrame } = render(<Header />);
    const output = lastFrame();

    expect(output).toContain('═'.repeat(60));
  });

  it('should handle long titles gracefully', () => {
    const longTitle = 'This is a very long portfolio title that might exceed normal length';
    const { lastFrame } = render(<Header title={longTitle} />);
    const output = lastFrame();

    expect(output).toContain(longTitle.toUpperCase());
    expect(output).toContain('Full Stack Developer');
  });

  it('should handle empty title', () => {
    const { lastFrame } = render(<Header title="" />);
    const output = lastFrame();

    expect(output).toContain('Full Stack Developer');
    expect(output).toContain('╔══════════════════════════════════════════════════════════╗');
  });
});