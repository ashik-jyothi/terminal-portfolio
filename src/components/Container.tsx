import React from 'react';
import { Box, useStdout } from 'ink';
import type { ContainerProps } from '../types/app';
import { detectTerminalCapabilities } from '../utils/terminalCapabilities';

const Container: React.FC<ContainerProps> = React.memo(({ children, padding = 2 }) => {
  const { stdout } = useStdout();
  const capabilities = detectTerminalCapabilities();
  
  // Get current terminal dimensions with fallbacks
  const terminalWidth = stdout.columns || 80;
  const terminalHeight = stdout.rows || 24;
  
  // Calculate responsive dimensions - use more of the available space
  const containerWidth = Math.max(capabilities.minWidth, Math.min(terminalWidth - 8, Math.max(120, terminalWidth * 0.8)));
  const maxHeight = Math.max(capabilities.minHeight - 8, terminalHeight - 12);
  
  // Determine border style based on capabilities
  const borderStyle = capabilities.supportsBorders ? "round" : "single";
  const borderColor = capabilities.supportsColor ? "gray" : undefined;
  
  return (
    <Box
      flexDirection="column"
      width={containerWidth}
      height={maxHeight}
      paddingX={padding}
      paddingY={1}
      borderStyle={borderStyle}
      borderColor={borderColor}
      justifyContent="flex-start"
      alignItems="center"
    >
      <Box flexDirection="column" width="100%" alignItems="center">
        {children}
      </Box>
    </Box>
  );
});

Container.displayName = 'Container';

export default Container;