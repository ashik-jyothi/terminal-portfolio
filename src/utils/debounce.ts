/**
 * Debounce utilities for optimizing terminal redraws and state updates
 */

/**
 * Creates a debounced version of a function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): T & { cancel: () => void } {
  let timeout: NodeJS.Timeout | null = null;
  let result: ReturnType<T>;

  const debounced = function (this: any, ...args: Parameters<T>) {
    const context = this;
    
    const later = () => {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
    
    if (callNow) {
      result = func.apply(context, args);
    }
    
    return result;
  } as T & { cancel: () => void };

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}

/**
 * Creates a throttled version of a function that only invokes func at most once per every wait milliseconds.
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): T & { cancel: () => void } {
  let timeout: NodeJS.Timeout | null = null;
  let previous = 0;
  let result: ReturnType<T>;
  
  const { leading = true, trailing = true } = options;

  const throttled = function (this: any, ...args: Parameters<T>) {
    const context = this;
    const now = Date.now();
    
    if (!previous && !leading) {
      previous = now;
    }
    
    const remaining = wait - (now - previous);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
    } else if (!timeout && trailing) {
      timeout = setTimeout(() => {
        previous = !leading ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
      }, remaining);
    }
    
    return result;
  } as T & { cancel: () => void };

  throttled.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    previous = 0;
  };

  return throttled;
}

/**
 * React hook for debounced state updates
 */
import { useState, useEffect, useRef } from 'react';

export function useDebouncedState<T>(
  initialValue: T,
  delay: number
): [T, T, (value: T) => void] {
  const [immediateValue, setImmediateValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setValue = (value: T) => {
    setImmediateValue(value);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [immediateValue, debouncedValue, setValue];
}

/**
 * React hook for throttled state updates
 */
export function useThrottledState<T>(
  initialValue: T,
  delay: number
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const lastUpdateRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setThrottledValue = (newValue: T) => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;
    
    if (timeSinceLastUpdate >= delay) {
      setValue(newValue);
      lastUpdateRef.current = now;
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setValue(newValue);
        lastUpdateRef.current = Date.now();
      }, delay - timeSinceLastUpdate);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [value, setThrottledValue];
}

/**
 * Optimized state updater that batches multiple updates
 */
export function createBatchedUpdater<T>(
  setState: (updater: (prev: T) => T) => void,
  batchDelay: number = 16 // ~60fps
) {
  let pendingUpdates: Array<(prev: T) => T> = [];
  let timeoutId: NodeJS.Timeout | null = null;

  const flushUpdates = () => {
    if (pendingUpdates.length === 0) return;
    
    const updates = [...pendingUpdates];
    pendingUpdates = [];
    
    setState(prev => {
      return updates.reduce((current, update) => update(current), prev);
    });
  };

  return (updater: (prev: T) => T) => {
    pendingUpdates.push(updater);
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(flushUpdates, batchDelay);
  };
}