import React from 'react';
import { render } from 'ink-testing-library';
import { vi } from 'vitest';
import Navigation from '../Navigation';

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
    arrow: '→'
  }))
}));

describe('Navigation', () => {
  const mockOnSectionChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render navigation menu items', () => {
    const { lastFrame } = render(
      <Navigation currentSection="home" onSectionChange={mockOnSectionChange} />
    );
    const output = lastFrame();

    expect(output).toContain('[1] Home');
    expect(output).toContain('[2] About');
    expect(output).toContain('[3] Skills');
    expect(output).toContain('[4] Projects');
    expect(output).toContain('[5] Contact');
  });

  it('should highlight current section', () => {
    const { lastFrame } = render(
      <Navigation currentSection="about" onSectionChange={mockOnSectionChange} />
    );
    const output = lastFrame();

    expect(output).toContain('Current Section: ABOUT');
  });

  it('should display navigation instructions', () => {
    const { lastFrame } = render(
      <Navigation currentSection="home" onSectionChange={mockOnSectionChange} />
    );
    const output = lastFrame();

    expect(output).toContain('Navigation: Arrow keys, vim (hjkl), numbers (1-5)');
    expect(output).toContain("'g' (home), 'G' (contact)");
    expect(output).toContain("'q'/ESC/Ctrl+C to exit");
  });

  it('should show visual indicator for current section', () => {
    const { lastFrame } = render(
      <Navigation currentSection="skills" onSectionChange={mockOnSectionChange} />
    );
    const output = lastFrame();

    expect(output).toContain('You are here');
  });

  it('should render correctly for each section', () => {
    const sections = ['home', 'about', 'skills', 'projects', 'contact'] as const;
    
    sections.forEach(section => {
      const { lastFrame } = render(
        <Navigation currentSection={section} onSectionChange={mockOnSectionChange} />
      );
      const output = lastFrame();

      expect(output).toContain(`Current Section: ${section.toUpperCase()}`);
    });
  });

  it('should handle terminal without color support', () => {
    const { detectTerminalCapabilities } = require('../../utils/terminalCapabilities');
    detectTerminalCapabilities.mockReturnValue({
      supportsColor: false,
      supportsUnicode: true,
      supportsBorders: true,
      supportsResize: true
    });

    const { lastFrame } = render(
      <Navigation currentSection="home" onSectionChange={mockOnSectionChange} />
    );
    const output = lastFrame();

    // Should still render navigation items
    expect(output).toContain('[1] Home');
    expect(output).toContain('Current Section: HOME');
  });
});