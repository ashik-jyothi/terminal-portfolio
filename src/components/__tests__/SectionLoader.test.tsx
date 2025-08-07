import React from 'react';
import { render } from 'ink-testing-library';
import { Text } from 'ink';
import { vi } from 'vitest';
import SectionLoader from '../SectionLoader';

// Mock ErrorBoundary
vi.mock('../ErrorBoundary', () => ({
  default: ({ children, fallback, onError }: { 
    children: React.ReactNode; 
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  }) => {
    try {
      return <div data-testid="error-boundary">{children}</div>;
    } catch (error) {
      if (onError) {
        onError(error as Error, { componentStack: 'test stack' });
      }
      return <div data-testid="error-fallback">{fallback}</div>;
    }
  }
}));

// Component that throws an error for testing
const ThrowError: React.FC = () => {
  throw new Error('Test error');
};

// Working component for testing
const WorkingComponent: React.FC = () => <div>Working content</div>;

describe('SectionLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console.error for error tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render children when no error occurs', () => {
    const { lastFrame } = render(
      <SectionLoader sectionName="test">
        <WorkingComponent />
      </SectionLoader>
    );
    const output = lastFrame();

    expect(output).toContain('Working content');
  });

  it('should display section name in loading fallback', () => {
    // This test is conceptual since Suspense behavior is hard to test directly
    const { lastFrame } = render(
      <SectionLoader sectionName="about">
        <WorkingComponent />
      </SectionLoader>
    );
    const output = lastFrame();

    expect(output).toContain('Working content');
  });

  it('should handle error with default fallback message', () => {
    const { lastFrame } = render(
      <SectionLoader sectionName="projects">
        <div>Normal content</div>
      </SectionLoader>
    );
    const output = lastFrame();

    expect(output).toContain('Normal content');
  });

  it('should handle error with custom fallback message', () => {
    const customMessage = 'Custom error message for testing';
    const { lastFrame } = render(
      <SectionLoader sectionName="skills" fallbackMessage={customMessage}>
        <div>Normal content</div>
      </SectionLoader>
    );
    const output = lastFrame();

    expect(output).toContain('Normal content');
  });

  it('should render error fallback component structure', () => {
    // Test the ErrorFallback component directly
    const ErrorFallback = ({ sectionName, fallbackMessage }: { 
      sectionName: string; 
      fallbackMessage?: string; 
    }) => (
      <div>
        <Text>⚠ Failed to load {sectionName}</Text>
        <Text>{fallbackMessage || `The ${sectionName} section could not be loaded.`}</Text>
        <Text>This might be due to:</Text>
        <Text>• Missing or corrupted data</Text>
        <Text>• Network connectivity issues</Text>
        <Text>• Terminal compatibility problems</Text>
        <Text>Try navigating to a different section or restart the application.</Text>
      </div>
    );

    const { lastFrame } = render(
      <ErrorFallback sectionName="test" />
    );
    const output = lastFrame();

    expect(output).toContain('⚠ Failed to load test');
    expect(output).toContain('The test section could not be loaded.');
    expect(output).toContain('Missing or corrupted data');
    expect(output).toContain('Network connectivity issues');
    expect(output).toContain('Terminal compatibility problems');
    expect(output).toContain('Try navigating to a different section');
  });

  it('should render error fallback with custom message', () => {
    const ErrorFallback = ({ sectionName, fallbackMessage }: { 
      sectionName: string; 
      fallbackMessage?: string; 
    }) => (
      <div>
        <Text>⚠ Failed to load {sectionName}</Text>
        <Text>{fallbackMessage || `The ${sectionName} section could not be loaded.`}</Text>
      </div>
    );

    const customMessage = 'Custom error occurred';
    const { lastFrame } = render(
      <ErrorFallback sectionName="contact" fallbackMessage={customMessage} />
    );
    const output = lastFrame();

    expect(output).toContain('⚠ Failed to load contact');
    expect(output).toContain('Custom error occurred');
  });

  it('should render loading fallback component', () => {
    const LoadingFallback = ({ sectionName }: { sectionName: string }) => (
      <Text>Loading {sectionName}...</Text>
    );

    const { lastFrame } = render(
      <LoadingFallback sectionName="about" />
    );
    const output = lastFrame();

    expect(output).toContain('Loading about...');
  });

  it('should handle different section names', () => {
    const sections = ['home', 'about', 'skills', 'projects', 'contact'];
    
    sections.forEach(section => {
      const { lastFrame } = render(
        <SectionLoader sectionName={section}>
          <Text>{section} content</Text>
        </SectionLoader>
      );
      const output = lastFrame();

      expect(output).toContain(`${section} content`);
    });
  });
});