import React from 'react';
import { Box, Text } from 'ink';
import type { SectionProps } from '../types/app';
import { detectTerminalCapabilities, getFallbackChars } from '../utils/terminalCapabilities';

const Section: React.FC<SectionProps> = React.memo(({ title, children }) => {
  const capabilities = detectTerminalCapabilities();
  const fallbackChars = getFallbackChars(capabilities);
  
  return (
    <Box flexDirection="column" paddingY={1} alignItems="center">
      {/* Section Title */}
      <Box marginBottom={1}>
        <Text bold color={capabilities.supportsColor ? "yellow" : undefined}>
          {fallbackChars.bullet} {title.toUpperCase()}
        </Text>
      </Box>
      
      {/* Decorative underline */}
      <Box marginBottom={2}>
        <Text color={capabilities.supportsColor ? "yellow" : undefined} dimColor>
          {fallbackChars.horizontal.repeat(Math.min(title.length + 2, 50))}
        </Text>
      </Box>
      
      {/* Section Content */}
      <Box flexDirection="column" width="100%">
        {children}
      </Box>
      
      {/* Bottom spacing */}
      <Box marginTop={1}>
        <Text color={capabilities.supportsColor ? "gray" : undefined} dimColor>
          {fallbackChars.dot.repeat(40)}
        </Text>
      </Box>
    </Box>
  );
});

Section.displayName = 'Section';

export default Section;