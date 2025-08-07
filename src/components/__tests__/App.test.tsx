import React from 'react';
import { render } from 'ink-testing-library';
import { vi } from 'vitest';
import App from '../App';

// Mock all the hooks
vi.mock('../../hooks/useKeyboardNavigation', () => ({
  useKeyboardNavigation: vi.fn()
}));

vi.mock('../../hooks/useSession', () => ({
  useSession: vi.fn(() => ({
    sessionInfo: { sectionsVisited: ['home'] },
    updateActivity: vi.fn(),
    updateTerminalSize: vi.fn(),
    endSession: vi.fn(),
    isActive: true
  }))
}));

vi.mock('../../hooks/useTerminalResize', () => ({
  useTerminalResize: vi.fn(() => ({
    dimensions: { width: 80, height: 24 },
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

// Mock terminal capabilities
vi.mock('../../utils/terminalCapabilities', () => ({
  getFallbackChars: vi.fn(() => ({
    warning: '⚠',
    error: '✗',
    success: '✓',
    bullet: '•',
    arrow: '→'
  }))
}));

// Mock child components
vi.mock('../Header', () => ({
  default: ({ title }: { title: string }) => <div data-testid="header">{title}</div>
}));

vi.mock('../Navigation', () => ({
  default: ({ currentSection }: { currentSection: string }) => (
    <div data-testid="navigation" data-current={currentSection}>Navigation</div>
  )
}));

vi.mock('../Container', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="container">{children}</div>
  )
}));

vi.mock('../Section', () => ({
  default: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div data-testid="section" data-title={title}>{children}</div>
  )
}));

vi.mock('../SectionLoader', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="section-loader">{children}</div>
  )
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the main application structure', () => {
    const { lastFrame } = render(<App />);
    const output = lastFrame();

    expect(output).toContain("Ashik Jyothi's Portfolio");
    expect(output).toContain('Navigation');
    expect(output).toContain('Terminal: 80x24');
  });

  it('should display session information', () => {
    const { lastFrame } = render(<App />);
    const output = lastFrame();

    expect(output).toContain('Session: 1 sections visited');
  });

  it('should show terminal capabilities status', () => {
    const { lastFrame } = render(<App />);
    const output = lastFrame();

    expect(output).toContain('Color support: ✓');
    expect(output).toContain('Unicode support: ✓');
    expect(output).toContain('Border support: ✓');
    expect(output).toContain('Resize support: ✓');
  });

  it('should display current section information', () => {
    const { lastFrame } = render(<App />);
    const output = lastFrame();

    expect(output).toContain('Current section: HOME');
    expect(output).toContain('Use navigation keys to explore different sections');
  });

  it('should handle loading state', () => {
    // Mock loading state
    const { useTerminalResize } = require('../../hooks/useTerminalResize');
    useTerminalResize.mockReturnValue({
      dimensions: { width: 80, height: 24 },
      isResizing: false,
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

    // Should not show loading after initial render
    expect(output).not.toContain('Loading Terminal Portfolio...');
  });
});