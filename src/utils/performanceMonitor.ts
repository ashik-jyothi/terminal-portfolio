/**
 * Performance monitoring utilities for the terminal portfolio application
 * Helps track startup time, render performance, and identify bottlenecks
 */

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private enabled: boolean = process.env.NODE_ENV === 'development';

  /**
   * Start timing a performance metric
   */
  start(name: string): void {
    if (!this.enabled) return;
    
    this.metrics.set(name, {
      name,
      startTime: performance.now()
    });
  }

  /**
   * End timing a performance metric
   */
  end(name: string): number | null {
    if (!this.enabled) return null;
    
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`Performance metric "${name}" was not started`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;
    
    this.metrics.set(name, {
      ...metric,
      endTime,
      duration
    });

    return duration;
  }

  /**
   * Get the duration of a completed metric
   */
  getDuration(name: string): number | null {
    if (!this.enabled) return null;
    
    const metric = this.metrics.get(name);
    return metric?.duration ?? null;
  }

  /**
   * Get all completed metrics
   */
  getAllMetrics(): PerformanceMetric[] {
    if (!this.enabled) return [];
    
    return Array.from(this.metrics.values()).filter(metric => metric.duration !== undefined);
  }

  /**
   * Log performance summary to console
   */
  logSummary(): void {
    if (!this.enabled) return;
    
    const completedMetrics = this.getAllMetrics();
    if (completedMetrics.length === 0) {
      console.log('📊 No performance metrics recorded');
      return;
    }

    console.log('\n📊 Performance Summary:');
    console.log('━'.repeat(50));
    
    completedMetrics
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))
      .forEach(metric => {
        const duration = metric.duration!;
        const status = duration < 100 ? '🟢' : duration < 500 ? '🟡' : '🔴';
        console.log(`${status} ${metric.name}: ${duration.toFixed(2)}ms`);
      });
    
    const totalTime = completedMetrics.reduce((sum, metric) => sum + (metric.duration || 0), 0);
    console.log('━'.repeat(50));
    console.log(`⏱️  Total measured time: ${totalTime.toFixed(2)}ms`);
    console.log('');
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
  }

  /**
   * Enable or disable performance monitoring
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Check if performance monitoring is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }
}

// Global performance monitor instance
const performanceMonitor = new PerformanceMonitor();

/**
 * Higher-order component for measuring component render time
 */
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> {
  if (!performanceMonitor.isEnabled()) {
    return Component;
  }

  return function PerformanceMonitoredComponent(props: P) {
    React.useEffect(() => {
      performanceMonitor.start(`${componentName} render`);
      return () => {
        performanceMonitor.end(`${componentName} render`);
      };
    });

    return React.createElement(Component, props);
  };
}

/**
 * Hook for measuring performance within components
 */
export function usePerformanceMonitor(metricName: string) {
  const start = React.useCallback(() => {
    performanceMonitor.start(metricName);
  }, [metricName]);

  const end = React.useCallback(() => {
    return performanceMonitor.end(metricName);
  }, [metricName]);

  return { start, end };
}

/**
 * Measure the execution time of an async function
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  performanceMonitor.start(name);
  try {
    const result = await fn();
    return result;
  } finally {
    performanceMonitor.end(name);
  }
}

/**
 * Measure the execution time of a synchronous function
 */
export function measureSync<T>(
  name: string,
  fn: () => T
): T {
  performanceMonitor.start(name);
  try {
    const result = fn();
    return result;
  } finally {
    performanceMonitor.end(name);
  }
}

export default performanceMonitor;

// Import React for the HOC and hook
import React from 'react';