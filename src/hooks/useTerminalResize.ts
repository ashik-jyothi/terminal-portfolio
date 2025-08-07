import { useState, useEffect, useCallback } from 'react';
import { useStdout } from 'ink';
import { detectTerminalCapabilities, validateTerminalDimensions } from '../utils/terminalCapabilities';
import type { TerminalDimensions } from '../types/app';

interface UseTerminalResizeOptions {
  debounceMs?: number;
  onResize?: (dimensions: TerminalDimensions) => void;
  onError?: (error: Error) => void;
}

interface TerminalResizeState {
  dimensions: TerminalDimensions;
  isResizing: boolean;
  warnings: string[];
  capabilities: ReturnType<typeof detectTerminalCapabilities>;
}

export const useTerminalResize = (options: UseTerminalResizeOptions = {}) => {
  const { debounceMs = 100, onResize, onError } = options;
  const { stdout } = useStdout();
  
  const [state, setState] = useState<TerminalResizeState>(() => {
    const capabilities = detectTerminalCapabilities();
    const initialWidth = stdout.columns || 80;
    const initialHeight = stdout.rows || 24;
    
    const validated = validateTerminalDimensions(initialWidth, initialHeight, capabilities);
    
    return {
      dimensions: { width: validated.width, height: validated.height },
      isResizing: false,
      warnings: Object.values(validated.warnings).filter(Boolean) as string[],
      capabilities
    };
  });

  const updateDimensions = useCallback(() => {
    try {
      const width = stdout.columns || 80;
      const height = stdout.rows || 24;
      
      const validated = validateTerminalDimensions(width, height, state.capabilities);
      const newDimensions = { width: validated.width, height: validated.height };
      
      // Only update state if dimensions actually changed
      setState(prev => {
        const dimensionsChanged = 
          prev.dimensions.width !== newDimensions.width || 
          prev.dimensions.height !== newDimensions.height;
        
        if (!dimensionsChanged && !prev.isResizing) {
          return prev; // No change needed
        }
        
        return {
          ...prev,
          dimensions: newDimensions,
          isResizing: false,
          warnings: Object.values(validated.warnings).filter(Boolean) as string[]
        };
      });
      
      if (onResize) {
        onResize(newDimensions);
      }
    } catch (error) {
      if (onError && error instanceof Error) {
        onError(error);
      }
      console.error('Error updating terminal dimensions:', error);
    }
  }, [stdout.columns, stdout.rows, onResize, onError]);

  useEffect(() => {
    if (!state.capabilities.supportsResize) {
      return;
    }

    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      setState(prev => ({ ...prev, isResizing: true }));
      
      // Debounce resize events
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDimensions, debounceMs);
    };

    try {
      stdout.on('resize', handleResize);
    } catch (error) {
      if (onError && error instanceof Error) {
        onError(error);
      }
      console.error('Error setting up resize listener:', error);
    }

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      try {
        stdout.off('resize', handleResize);
      } catch (error) {
        console.error('Error cleaning up resize listener:', error);
      }
    };
  }, [stdout, debounceMs, updateDimensions, state.capabilities.supportsResize, onError]);

  return {
    dimensions: state.dimensions,
    isResizing: state.isResizing,
    warnings: state.warnings,
    capabilities: state.capabilities,
    updateDimensions
  };
};