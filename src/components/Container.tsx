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
  
  // Calculate responsive dimensions
  const containerWidth = Math.max(capabilities.minWidth, Math.min(terminalWidth - 4, 120));
  const maxHeight = Math.max(capabilities.minHeight - 8, terminalHeight - 8);
  
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
      alignItems="stretch"
    >
      {children}
    </Box>
  );
});

Container.displayName = 'Container';

export default Container;