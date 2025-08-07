/**
 * Component Integration Tests
 * Tests for component rendering and basic functionality
 */

import React from 'react';
import { render } from 'ink-testing-library';
import { Text } from 'ink';
import { describe, it, expect, vi } from 'vitest';

// Import components
import Header from '../Header';
import Container from '../Container';
import Section from '../Section';
import AboutSection from '../AboutSection';
import SkillsSection from '../SkillsSection';
import ProjectsSection from '../ProjectsSection';
import ContactSection from '../ContactSection';
import Navigation from '../Navigation';

// Mock terminal capabilities to ensure consistent test results
vi.mock('../../utils/terminalCapabilities', () => ({
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

// Mock useStdout for Container component
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

describe('Component Integration Tests', () => {
  describe('Header Component', () => {
    it('should render with default title', () => {
      const { lastFrame } = render(<Header />);
      const output = lastFrame();

      expect(output).toContain('TERMINAL PORTFOLIO');
      expect(output).toContain('Full Stack Developer');
    });

    it('should render with custom title', () => {
      const { lastFrame } = render(<Header title="Custom Title" />);
      const output = lastFrame();

      expect(output).toContain('CUSTOM TITLE');
    });

    it('should include decorative elements', () => {
      const { lastFrame } = render(<Header />);
      const output = lastFrame();

      expect(output).toContain('╔');
      expect(output).toContain('╚');
      expect(output).toContain('🚀');
    });
  });

  describe('Container Component', () => {
    it('should render children', () => {
      const { lastFrame } = render(
        <Container>
          <Text>Test Content</Text>
        </Container>
      );
      const output = lastFrame();

      expect(output).toContain('Test Content');
    });

    it('should handle custom padding', () => {
      const { lastFrame } = render(
        <Container padding={4}>
          <Text>Padded Content</Text>
        </Container>
      );
      const output = lastFrame();

      expect(output).toContain('Padded Content');
    });
  });

  describe('Section Component', () => {
    it('should render section with title and content', () => {
      const { lastFrame } = render(
        <Section title="Test Section">
          <Text>Section Content</Text>
        </Section>
      );
      const output = lastFrame();

      expect(output).toContain('TEST SECTION');
      expect(output).toContain('Section Content');
      expect(output).toContain('▶'); // bullet character
    });

    it('should include decorative elements', () => {
      const { lastFrame } = render(
        <Section title="About">
          <Text>Content</Text>
        </Section>
      );
      const output = lastFrame();

      expect(output).toContain('─'); // horizontal line
      expect(output).toContain('·'); // dots
    });
  });

  describe('Navigation Component', () => {
    const mockOnSectionChange = vi.fn();

    beforeEach(() => {
      mockOnSectionChange.mockClear();
    });

    it('should render navigation menu', () => {
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

    it('should show current section', () => {
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

      expect(output).toContain('Navigation:');
      expect(output).toContain('Arrow keys');
      expect(output).toContain('vim');
      expect(output).toContain('numbers');
    });
  });

  describe('Portfolio Section Components', () => {
    it('should render AboutSection', () => {
      const { lastFrame } = render(<AboutSection />);
      const output = lastFrame();

      // Should contain the section structure
      expect(output).toContain('ABOUT');
      expect(output).toContain('Ashik Jyothi');
    });

    it('should render SkillsSection', () => {
      const { lastFrame } = render(<SkillsSection />);
      const output = lastFrame();

      // Should contain the section structure
      expect(output).toContain('TECHNICAL SKILLS');
      expect(output).toContain('Frontend Development');
    });

    it('should render ProjectsSection', () => {
      const { lastFrame } = render(<ProjectsSection />);
      const output = lastFrame();

      // Should contain the section structure
      expect(output).toContain('PROJECTS');
      expect(output).toContain('Terminal Portfolio');
    });

    it('should render ContactSection', () => {
      const { lastFrame } = render(<ContactSection />);
      const output = lastFrame();

      // Should contain the section structure
      expect(output).toContain('CONTACT INFORMATION');
      expect(output).toContain('hello@ashikjyothi.dev');
    });
  });

  describe('Component Error Handling', () => {
    it('should handle missing props gracefully', () => {
      expect(() => {
        render(<Header title="" />);
      }).not.toThrow();
    });

    it('should handle empty content', () => {
      expect(() => {
        render(
          <Section title="Empty">
            <Text></Text>
          </Section>
        );
      }).not.toThrow();
    });
  });

  describe('Accessibility and Terminal Compatibility', () => {
    it('should work without color support', async () => {
      const { detectTerminalCapabilities } = vi.mocked(await import('../../utils/terminalCapabilities'));
      detectTerminalCapabilities.mockReturnValue({
        supportsColor: false,
        supportsUnicode: true,
        supportsBorders: true,
        supportsResize: true,
        minWidth: 60,
        minHeight: 20
      });

      const { lastFrame } = render(
        <Section title="Test">
          <Text>Content</Text>
        </Section>
      );
      const output = lastFrame();

      expect(output).toContain('TEST');
      expect(output).toContain('Content');
    });

    it('should work without unicode support', async () => {
      const { getFallbackChars } = vi.mocked(await import('../../utils/terminalCapabilities'));
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

      expect(output).toContain('TEST');
      expect(output).toContain('Content');
    });
  });
});