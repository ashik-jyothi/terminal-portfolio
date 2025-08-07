import React from 'react';
import { render } from 'ink-testing-library';
import { vi } from 'vitest';
import AboutSection from '../AboutSection';

// Mock the sample portfolio data
vi.mock('../../data/sample-portfolio.js', () => ({
  samplePortfolioData: {
    personal: {
      name: 'Test User',
      title: 'Test Developer',
      location: 'Test City, Test Country',
      bio: 'This is a test bio for the about section.'
    }
  }
}));

// Mock the Section component
vi.mock('../Section.js', () => ({
  default: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div data-testid="section" data-title={title}>
      {children}
    </div>
  )
}));

describe('AboutSection', () => {
  it('should render personal information correctly', () => {
    const { lastFrame } = render(<AboutSection />);
    const output = lastFrame();

    expect(output).toContain('Test User');
    expect(output).toContain('Test Developer');
    expect(output).toContain('Test City, Test Country');
    expect(output).toContain('This is a test bio for the about section.');
  });

  it('should display greeting message', () => {
    const { lastFrame } = render(<AboutSection />);
    const output = lastFrame();

    expect(output).toContain('👋 Hello, I\'m Test User');
  });

  it('should show location with icon', () => {
    const { lastFrame } = render(<AboutSection />);
    const output = lastFrame();

    expect(output).toContain('📍 Test City, Test Country');
  });

  it('should display about section header', () => {
    const { lastFrame } = render(<AboutSection />);
    const output = lastFrame();

    expect(output).toContain('About:');
  });

  it('should show welcome message', () => {
    const { lastFrame } = render(<AboutSection />);
    const output = lastFrame();

    expect(output).toContain('✨ Welcome to my terminal portfolio!');
    expect(output).toContain('Navigate with arrow keys or numbers.');
  });
});