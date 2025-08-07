import React from 'react';
import { render } from 'ink-testing-library';
import ErrorBoundary from '../ErrorBoundary';

// Component that throws an error for testing
const ThrowError: React.FC = () => {
  throw new Error('Test error');
};

// Component that works normally
const WorkingComponent: React.FC = () => <div>Working component</div>;

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it('should render children when there is no error', () => {
    const { lastFrame } = render(
      <ErrorBoundary>
        <WorkingComponent />
      </ErrorBoundary>
    );

    expect(lastFrame()).toContain('Working component');
  });

  it('should render error UI when child component throws', () => {
    const { lastFrame } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(lastFrame()).toContain('Something went wrong');
    expect(lastFrame()).toContain('Test error');
  });

  it('should render custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>;
    
    const { lastFrame } = render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(lastFrame()).toContain('Custom error message');
  });

  it('should call onError callback when error occurs', () => {
    const onError = jest.fn();
    
    render(
      <ErrorBoundary onError={onError}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    );
  });
});