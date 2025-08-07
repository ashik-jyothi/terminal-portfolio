import React, { Suspense } from 'react';
import { Box, Text } from 'ink';
import ErrorBoundary from './ErrorBoundary';

interface SectionLoaderProps {
  children: React.ReactNode;
  sectionName: string;
  fallbackMessage?: string;
}

const LoadingFallback: React.FC<{ sectionName: string }> = React.memo(({ sectionName }) => (
  <Box flexDirection="column" alignItems="center" justifyContent="center" padding={2}>
    <Text color="yellow">Loading {sectionName}...</Text>
  </Box>
));

LoadingFallback.displayName = 'LoadingFallback';

const ErrorFallback: React.FC<{ sectionName: string; fallbackMessage?: string }> = React.memo(({ 
  sectionName, 
  fallbackMessage 
}) => (
  <Box flexDirection="column" alignItems="center" justifyContent="center" padding={2}>
    <Box marginBottom={1}>
      <Text color="red" bold>⚠ Failed to load {sectionName}</Text>
    </Box>
    
    <Box marginBottom={2}>
      <Text color="yellow">
        {fallbackMessage || `The ${sectionName} section could not be loaded.`}
      </Text>
    </Box>
    
    <Box marginBottom={1}>
      <Text dimColor>
        This might be due to:
      </Text>
    </Box>
    
    <Box flexDirection="column" marginLeft={2} marginBottom={2}>
      <Text dimColor>• Missing or corrupted data</Text>
      <Text dimColor>• Network connectivity issues</Text>
      <Text dimColor>• Terminal compatibility problems</Text>
    </Box>
    
    <Box>
      <Text color="cyan">
        Try navigating to a different section or restart the application.
      </Text>
    </Box>
  </Box>
));

ErrorFallback.displayName = 'ErrorFallback';

const SectionLoader: React.FC<SectionLoaderProps> = React.memo(({ 
  children, 
  sectionName, 
  fallbackMessage 
}) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log section-specific errors
    console.error(`Error in ${sectionName} section:`, error, errorInfo);
  };

  return (
    <ErrorBoundary
      fallback={<ErrorFallback sectionName={sectionName} fallbackMessage={fallbackMessage} />}
      onError={handleError}
    >
      <Suspense fallback={<LoadingFallback sectionName={sectionName} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
});

SectionLoader.displayName = 'SectionLoader';

export default SectionLoader;