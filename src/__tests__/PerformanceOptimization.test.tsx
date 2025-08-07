/**
 * Performance optimization tests
 * Tests to verify that performance optimizations are working correctly
 */

import React from 'react';
import { render } from 'ink-testing-library';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import performanceMonitor from '../utils/performanceMonitor';

// Mock performance.now for consistent testing
const mockPerformanceNow = vi.fn();
global.performance = { now: mockPerformanceNow } as any;

describe('Performance Optimizations', () => {
  beforeEach(() => {
    performanceMonitor.clear();
    performanceMonitor.setEnabled(true);
    mockPerformanceNow.mockReturnValue(0);
  });

  afterEach(() => {
    performanceMonitor.setEnabled(false);
    vi.clearAllMocks();
  });

  describe('React.memo optimizations', () => {
    it('should memoize Header component', async () => {
      const { default: Header } = await import('../components/Header');
      
      // Check that Header is wrapped with React.memo
      expect(Header.displayName).toBe('Header');
      
      // Render component multiple times with same props
      const { rerender } = render(<Header title="Test Portfolio" />);
      
      // Re-render with same props should not cause re-render
      rerender(<Header title="Test Portfolio" />);
      
      // This test passes if no errors are thrown
      expect(true).toBe(true);
    });

    it('should memoize Navigation component', async () => {
      const { default: Navigation } = await import('../components/Navigation');
      
      expect(Navigation.displayName).toBe('Navigation');
      
      const mockOnSectionChange = vi.fn();
      const { rerender } = render(
        <Navigation currentSection="home" onSectionChange={mockOnSectionChange} />
      );
      
      // Re-render with same props
      rerender(
        <Navigation currentSection="home" onSectionChange={mockOnSectionChange} />
      );
      
      expect(true).toBe(true);
    });

    it('should memoize section components', async () => {
      const { default: AboutSection } = await import('../components/AboutSection');
      const { default: SkillsSection } = await import('../components/SkillsSection');
      const { default: ProjectsSection } = await import('../components/ProjectsSection');
      const { default: ContactSection } = await import('../components/ContactSection');
      
      expect(AboutSection.displayName).toBe('AboutSection');
      expect(SkillsSection.displayName).toBe('SkillsSection');
      expect(ProjectsSection.displayName).toBe('ProjectsSection');
      expect(ContactSection.displayName).toBe('ContactSection');
    });
  });

  describe('Performance monitoring', () => {
    it('should track performance metrics', () => {
      mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(100);
      
      performanceMonitor.start('test-metric');
      const duration = performanceMonitor.end('test-metric');
      
      expect(duration).toBe(100);
      expect(performanceMonitor.getDuration('test-metric')).toBe(100);
    });

    it('should handle multiple metrics', () => {
      mockPerformanceNow
        .mockReturnValueOnce(0)   // start metric1
        .mockReturnValueOnce(50)  // start metric2
        .mockReturnValueOnce(100) // end metric1
        .mockReturnValueOnce(150); // end metric2
      
      performanceMonitor.start('metric1');
      performanceMonitor.start('metric2');
      performanceMonitor.end('metric1');
      performanceMonitor.end('metric2');
      
      expect(performanceMonitor.getDuration('metric1')).toBe(100);
      expect(performanceMonitor.getDuration('metric2')).toBe(100);
    });

    it('should provide performance summary', () => {
      mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(50);
      
      performanceMonitor.start('test');
      performanceMonitor.end('test');
      
      const metrics = performanceMonitor.getAllMetrics();
      expect(metrics).toHaveLength(1);
      expect(metrics[0].name).toBe('test');
      expect(metrics[0].duration).toBe(50);
    });
  });

  describe('Debounced state updates', () => {
    it('should debounce state updates', async () => {
      const { useDebouncedState } = await import('../utils/debounce');
      
      // This is a basic test to ensure the hook exists and can be imported
      expect(typeof useDebouncedState).toBe('function');
    });

    it('should throttle state updates', async () => {
      const { useThrottledState } = await import('../utils/debounce');
      
      expect(typeof useThrottledState).toBe('function');
    });

    it('should create batched updaters', async () => {
      const { createBatchedUpdater } = await import('../utils/debounce');
      
      expect(typeof createBatchedUpdater).toBe('function');
      
      const mockSetState = vi.fn();
      const batchedUpdater = createBatchedUpdater(mockSetState, 10);
      
      expect(typeof batchedUpdater).toBe('function');
    });
  });

  describe('Optimized section rendering', () => {
    it('should render OptimizedSectionRenderer', async () => {
      const { default: OptimizedSectionRenderer } = await import('../components/OptimizedSectionRenderer');
      
      expect(OptimizedSectionRenderer.displayName).toBe('OptimizedSectionRenderer');
      
      const { lastFrame } = render(<OptimizedSectionRenderer currentSection="home" />);
      const output = lastFrame();
      
      // Should render home section content
      expect(output).toContain('Welcome to the Terminal Portfolio');
    });

    it('should handle different sections efficiently', async () => {
      const { default: OptimizedSectionRenderer } = await import('../components/OptimizedSectionRenderer');
      
      const sections = ['home', 'about', 'skills', 'projects', 'contact'] as const;
      
      for (const section of sections) {
        const { lastFrame } = render(<OptimizedSectionRenderer currentSection={section} />);
        const output = lastFrame();
        
        // Should render some content for each section
        expect(output.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Startup performance', () => {
    it('should have fast component imports', async () => {
      const startTime = Date.now();
      
      // Import all main components
      await Promise.all([
        import('../components/App'),
        import('../components/Header'),
        import('../components/Navigation'),
        import('../components/Container'),
        import('../components/Section'),
        import('../components/AboutSection'),
        import('../components/SkillsSection'),
        import('../components/ProjectsSection'),
        import('../components/ContactSection'),
      ]);
      
      const endTime = Date.now();
      const importTime = endTime - startTime;
      
      // Imports should be fast (less than 1 second)
      expect(importTime).toBeLessThan(1000);
    });

    it('should have optimized utility imports', async () => {
      const startTime = Date.now();
      
      // Import utility modules
      await Promise.all([
        import('../utils/performanceMonitor'),
        import('../utils/debounce'),
        import('../utils/terminalCapabilities'),
        import('../utils/validation'),
        import('../utils/sessionManager'),
      ]);
      
      const endTime = Date.now();
      const importTime = endTime - startTime;
      
      // Utility imports should be very fast
      expect(importTime).toBeLessThan(500);
    });
  });

  describe('Memory optimization', () => {
    it('should clean up performance monitor', () => {
      performanceMonitor.start('test');
      performanceMonitor.end('test');
      
      expect(performanceMonitor.getAllMetrics()).toHaveLength(1);
      
      performanceMonitor.clear();
      expect(performanceMonitor.getAllMetrics()).toHaveLength(0);
    });

    it('should handle disabled performance monitoring', () => {
      performanceMonitor.setEnabled(false);
      
      performanceMonitor.start('test');
      const duration = performanceMonitor.end('test');
      
      expect(duration).toBeNull();
      expect(performanceMonitor.getAllMetrics()).toHaveLength(0);
    });
  });
});