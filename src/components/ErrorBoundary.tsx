import React, { Component } from 'react';
import { Box, Text } from 'ink';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI or default error display
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box flexDirection="column" alignItems="center" justifyContent="center" padding={2}>
          <Box marginBottom={1}>
            <Text color="red" bold>⚠ Something went wrong</Text>
          </Box>
          
          <Box marginBottom={2}>
            <Text color="yellow">
              An error occurred while rendering this section.
            </Text>
          </Box>
          
          {this.state.error && (
            <Box marginBottom={2}>
              <Text color="gray" dimColor>
                Error: {this.state.error.message}
              </Text>
            </Box>
          )}
          
          <Box>
            <Text dimColor>
              Try navigating to a different section or restart the application.
            </Text>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;