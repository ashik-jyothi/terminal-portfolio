import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Text } from 'ink';
import type { AppState, SectionType } from '../types/app';
import Header from './Header';
import Container from './Container';
import Navigation from './Navigation';
import ErrorBoundary from './ErrorBoundary';
import OptimizedSectionRenderer from './OptimizedSectionRenderer';
import { useKeyboardNavigation, useSession } from '../hooks';
import { useTerminalResize } from '../hooks/useTerminalResize';
import { getFallbackChars } from '../utils/terminalCapabilities';
import { useDebouncedState, createBatchedUpdater } from '../utils/debounce';
import performanceMonitor from '../utils/performanceMonitor';

const App: React.FC = () => {
  // Start performance monitoring
  React.useEffect(() => {
    performanceMonitor.start('App component lifecycle');
    return () => {
      performanceMonitor.end('App component lifecycle');
    };
  }, []);

  // Initialize application state with debounced updates for better performance
  const [appState, setAppState] = useState<AppState>({
    currentSection: 'home',
    terminalDimensions: { width: 80, height: 24 },
    isLoading: true
  });

  // Use debounced state for error messages to prevent rapid re-renders
  const [, debouncedError, setAppError] = useDebouncedState<string | null>(null, 100);

  // Create batched updater for app state to optimize multiple rapid updates
  const batchedSetAppState = useMemo(
    () => createBatchedUpdater(setAppState, 16), // 60fps batching
    []
  );

  // Initialize session management
  const {
    sessionInfo,
    updateActivity,
    updateTerminalSize,
    endSession,
    isActive
  } = useSession({
    enableLogging: true,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    onSessionEnd: (reason) => {
      console.log(`Session ended: ${reason}`);
      if (reason === 'timeout') {
        setAppError('Session timed out due to inactivity');
      }
    }
  });

  // Enhanced terminal resize handling with error handling
  const { 
    dimensions, 
    isResizing, 
    warnings, 
    capabilities 
  } = useTerminalResize({
    debounceMs: 150,
    onResize: (newDimensions) => {
      setAppState(prev => ({
        ...prev,
        terminalDimensions: newDimensions
      }));
    },
    onError: (error) => {
      setAppError(`Terminal resize error: ${error.message}`);
    }
  });

  // Update app state with terminal dimensions using batched updates
  useEffect(() => {
    batchedSetAppState(prev => ({
      ...prev,
      terminalDimensions: dimensions,
      isLoading: false
    }));
    
    // Update session with terminal size
    updateTerminalSize(dimensions);
  }, [dimensions, updateTerminalSize]);

  // Optimized navigation state handling with batched updates and performance monitoring
  const handleSectionChange = useCallback((section: SectionType) => {
    performanceMonitor.start(`Section change to ${section}`);
    
    batchedSetAppState(prev => {
      // Prevent unnecessary state updates if section hasn't changed
      if (prev.currentSection === section) {
        return prev;
      }
      
      return {
        ...prev,
        currentSection: section
      };
    });
    
    // Update session activity with section visit
    updateActivity(section);
    
    performanceMonitor.end(`Section change to ${section}`);
  }, [updateActivity]);

  // Enhanced keyboard input handling with vim-style navigation and improved exit handling
  useKeyboardNavigation({
    currentSection: appState.currentSection,
    onSectionChange: handleSectionChange,
    onExit: () => {
      endSession('manual');
    }
  });

  // Memoize fallback characters to prevent recalculation on every render
  const fallbackChars = useMemo(() => getFallbackChars(capabilities), [capabilities]);

  // Optimized application error handler with useCallback
  const handleAppError = useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    setAppError(`Application error: ${error.message}`);
    console.error('App-level error:', error, errorInfo);
  }, []);

  // Optimized loading state with better visual feedback
  if (appState.isLoading) {
    return (
      <Box justifyContent="center" alignItems="center" height={appState.terminalDimensions.height}>
        <Box flexDirection="column" alignItems="center">
          <Box marginBottom={1}>
            <Text color={capabilities.supportsColor ? "cyan" : undefined} bold>
              {fallbackChars.loading} Initializing Terminal Portfolio...
            </Text>
          </Box>
          <Box marginBottom={1}>
            <Text dimColor>
              {fallbackChars.dot} Loading components and optimizing performance
            </Text>
          </Box>
          {warnings.length > 0 && (
            <Box marginTop={1}>
              <Text color={capabilities.supportsColor ? "yellow" : undefined} dimColor>
                {fallbackChars.warning} Terminal warnings: {warnings.join(', ')}
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  // Main application render with error boundary
  return (
    <ErrorBoundary onError={handleAppError}>
      <Box flexDirection="column" width={appState.terminalDimensions.width} height={appState.terminalDimensions.height}>
        {/* App-level error display using debounced error state */}
        {debouncedError && (
          <Box justifyContent="center" marginBottom={1}>
            <Text color={capabilities.supportsColor ? "red" : undefined}>
              {fallbackChars.error} {debouncedError}
            </Text>
          </Box>
        )}

        {/* Terminal capability warnings */}
        {warnings.length > 0 && (
          <Box justifyContent="center" marginBottom={1}>
            <Text color="yellow" dimColor>
              {fallbackChars.warning} {warnings.join(', ')}
            </Text>
          </Box>
        )}

        {/* Header with ASCII art */}
        <ErrorBoundary fallback={
          <Box justifyContent="center" padding={1}>
            <Text color="red">{fallbackChars.error} Header failed to load</Text>
          </Box>
        }>
          <Header title="Ashik Jyothi's Portfolio" />
        </ErrorBoundary>

        {/* Navigation component with section options and current section highlighting */}
        <ErrorBoundary fallback={
          <Box justifyContent="center" padding={1}>
            <Text color="red">{fallbackChars.error} Navigation failed to load</Text>
            <Text dimColor>Use 'q' to exit</Text>
          </Box>
        }>
          <Navigation 
            currentSection={appState.currentSection} 
            onSectionChange={handleSectionChange} 
          />
        </ErrorBoundary>

        {/* Terminal and session status indicator */}
        <Box justifyContent="center" marginBottom={1}>
          <Text dimColor>
            Terminal: {appState.terminalDimensions.width}x{appState.terminalDimensions.height}
            {isResizing && ' (resizing...)'}
            {!capabilities.supportsColor && ' (no color)'}
            {!capabilities.supportsUnicode && ' (no unicode)'}
            {sessionInfo && ` | Session: ${sessionInfo.sectionsVisited.length} sections visited`}
            {!isActive && ' (session ended)'}
          </Text>
        </Box>

        {/* Main content area with optimized section rendering */}
        <Box justifyContent="center" flexGrow={1}>
          <ErrorBoundary fallback={
            <Box padding={2} alignItems="center" justifyContent="center">
              <Text color={capabilities.supportsColor ? "red" : undefined}>
                {fallbackChars.error} Container failed to load
              </Text>
            </Box>
          }>
            <Container>
              <OptimizedSectionRenderer currentSection={appState.currentSection} />
            </Container>
          </ErrorBoundary>
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

export default App;