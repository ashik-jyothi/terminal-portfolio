import React from 'react';
import { render } from 'ink-testing-library';
import { vi } from 'vitest';
import { useKeyboardNavigation } from '../useKeyboardNavigation';

// Mock useInput from ink
vi.mock('ink', async () => {
  const actual = await vi.importActual('ink');
  return {
    ...actual,
    useInput: vi.fn()
  };
});

// Mock process.exit
const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error('process.exit called');
});

// Test component that uses the hook
const TestComponent: React.FC<{
  currentSection: any;
  onSectionChange: (section: any) => void;
  onExit?: () => void;
}> = ({ currentSection, onSectionChange, onExit }) => {
  useKeyboardNavigation({ currentSection, onSectionChange, onExit });
  return <div>Current: {currentSection}</div>;
};

describe('useKeyboardNavigation', () => {
  const mockOnSectionChange = vi.fn();
  const mockOnExit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockExit.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should register input handler', async () => {
    const { useInput } = await import('ink');
    
    render(
      <TestComponent 
        currentSection="home" 
        onSectionChange={mockOnSectionChange}
      />
    );

    expect(useInput).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should handle arrow key navigation - right/down', async () => {
    const { useInput } = await import('ink');
    let inputHandler: (input: string, key: any) => void;

    useInput.mockImplementation((handler) => {
      inputHandler = handler;
    });

    render(
      <TestComponent 
        currentSection="home" 
        onSectionChange={mockOnSectionChange}
      />
    );

    // Test right arrow
    inputHandler('', { rightArrow: true });
    expect(mockOnSectionChange).toHaveBeenCalledWith('about');

    // Reset mock
    mockOnSectionChange.mockClear();

    // Test down arrow
    inputHandler('', { downArrow: true });
    expect(mockOnSectionChange).toHaveBeenCalledWith('about');
  });

  it('should handle arrow key navigation - left/up', async () => {
    const { useInput } = await import('ink');
    let inputHandler: (input: string, key: any) => void;

    useInput.mockImplementation((handler) => {
      inputHandler = handler;
    });

    render(
      <TestComponent 
        currentSection="about" 
        onSectionChange={mockOnSectionChange}
      />
    );

    // Test left arrow
    inputHandler('', { leftArrow: true });
    expect(mockOnSectionChange).toHaveBeenCalledWith('home');

    // Reset mock
    mockOnSectionChange.mockClear();

    // Test up arrow
    inputHandler('', { upArrow: true });
    expect(mockOnSectionChange).toHaveBeenCalledWith('home');
  });

  it('should handle vim-style navigation', async () => {
    const { useInput } = await import('ink');
    let inputHandler: (input: string, key: any) => void;

    useInput.mockImplementation((handler) => {
      inputHandler = handler;
    });

    render(
      <TestComponent 
        currentSection="skills" 
        onSectionChange={mockOnSectionChange}
      />
    );

    // Test vim keys
    inputHandler('h', {}); // left
    expect(mockOnSectionChange).toHaveBeenCalledWith('about');

    mockOnSectionChange.mockClear();
    inputHandler('l', {}); // right
    expect(mockOnSectionChange).toHaveBeenCalledWith('projects');

    mockOnSectionChange.mockClear();
    inputHandler('k', {}); // up (previous)
    expect(mockOnSectionChange).toHaveBeenCalledWith('about');

    mockOnSectionChange.mockClear();
    inputHandler('j', {}); // down (next)
    expect(mockOnSectionChange).toHaveBeenCalledWith('projects');
  });

  it('should handle number key shortcuts', async () => {
    const { useInput } = await import('ink');
    let inputHandler: (input: string, key: any) => void;

    useInput.mockImplementation((handler) => {
      inputHandler = handler;
    });

    render(
      <TestComponent 
        currentSection="home" 
        onSectionChange={mockOnSectionChange}
      />
    );

    // Test number keys
    inputHandler('1', {});
    expect(mockOnSectionChange).toHaveBeenCalledWith('home');

    mockOnSectionChange.mockClear();
    inputHandler('2', {});
    expect(mockOnSectionChange).toHaveBeenCalledWith('about');

    mockOnSectionChange.mockClear();
    inputHandler('3', {});
    expect(mockOnSectionChange).toHaveBeenCalledWith('skills');

    mockOnSectionChange.mockClear();
    inputHandler('4', {});
    expect(mockOnSectionChange).toHaveBeenCalledWith('projects');

    mockOnSectionChange.mockClear();
    inputHandler('5', {});
    expect(mockOnSectionChange).toHaveBeenCalledWith('contact');
  });

  it('should handle special vim shortcuts', async () => {
    const { useInput } = await import('ink');
    let inputHandler: (input: string, key: any) => void;

    useInput.mockImplementation((handler) => {
      inputHandler = handler;
    });

    render(
      <TestComponent 
        currentSection="skills" 
        onSectionChange={mockOnSectionChange}
      />
    );

    // Test 'g' for home
    inputHandler('g', {});
    expect(mockOnSectionChange).toHaveBeenCalledWith('home');

    mockOnSectionChange.mockClear();
    // Test 'G' for home (based on actual implementation)
    inputHandler('G', {});
    expect(mockOnSectionChange).toHaveBeenCalledWith('home');
  });

  it('should handle exit commands', async () => {
    const { useInput } = await import('ink');
    let inputHandler: (input: string, key: any) => void;

    useInput.mockImplementation((handler) => {
      inputHandler = handler;
    });

    render(
      <TestComponent 
        currentSection="home" 
        onSectionChange={mockOnSectionChange}
        onExit={mockOnExit}
      />
    );

    // Test 'q' key
    expect(() => inputHandler('q', {})).toThrow(/process\.exit/);
    expect(mockOnExit).toHaveBeenCalled();

    mockOnExit.mockClear();
    mockExit.mockClear();

    // Test Escape key
    expect(() => inputHandler('', { escape: true })).toThrow(/process\.exit/);
    expect(mockOnExit).toHaveBeenCalled();

    mockOnExit.mockClear();
    mockExit.mockClear();

    // Test Ctrl+C
    expect(() => inputHandler('c', { ctrl: true })).toThrow(/process\.exit/);
    expect(mockOnExit).toHaveBeenCalled();
  });

  it('should wrap around sections when navigating', async () => {
    const { useInput } = await import('ink');
    let inputHandler: (input: string, key: any) => void;

    useInput.mockImplementation((handler) => {
      inputHandler = handler;
    });

    // Test wrapping from last to first
    render(
      <TestComponent 
        currentSection="contact" 
        onSectionChange={mockOnSectionChange}
      />
    );

    inputHandler('', { rightArrow: true });
    expect(mockOnSectionChange).toHaveBeenCalledWith('home');

    mockOnSectionChange.mockClear();

    // Test wrapping from first to last
    render(
      <TestComponent 
        currentSection="home" 
        onSectionChange={mockOnSectionChange}
      />
    );

    inputHandler('', { leftArrow: true });
    expect(mockOnSectionChange).toHaveBeenCalledWith('contact');
  });

  it('should handle case insensitive vim keys', async () => {
    const { useInput } = await import('ink');
    let inputHandler: (input: string, key: any) => void;

    useInput.mockImplementation((handler) => {
      inputHandler = handler;
    });

    render(
      <TestComponent 
        currentSection="home" 
        onSectionChange={mockOnSectionChange}
      />
    );

    // Test uppercase vim keys
    inputHandler('H', {});
    expect(mockOnSectionChange).toHaveBeenCalledWith('contact');

    mockOnSectionChange.mockClear();
    inputHandler('L', {});
    expect(mockOnSectionChange).toHaveBeenCalledWith('about');
  });

  it('should ignore invalid number keys', async () => {
    const { useInput } = await import('ink');
    let inputHandler: (input: string, key: any) => void;

    useInput.mockImplementation((handler) => {
      inputHandler = handler;
    });

    render(
      <TestComponent 
        currentSection="home" 
        onSectionChange={mockOnSectionChange}
      />
    );

    // Test invalid number keys
    inputHandler('6', {});
    inputHandler('0', {});
    inputHandler('9', {});

    expect(mockOnSectionChange).not.toHaveBeenCalled();
  });
});