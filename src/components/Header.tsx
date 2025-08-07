import React from 'react';
import { Box, Text } from 'ink';
import type { HeaderProps } from '../types/app';

const Header: React.FC<HeaderProps> = React.memo(({ title = "Terminal Portfolio" }) => {
  // Use title in the header display
  return (
    <Box flexDirection="column" marginBottom={1}>
      {/* Simple ASCII Art Header */}
      <Box justifyContent="center" paddingY={1}>
        <Text color="cyan" bold>
          ╔══════════════════════════════════════════════════════════╗
        </Text>
      </Box>
      <Box justifyContent="center">
        <Text color="cyan" bold>
          ║  🚀 {title.toUpperCase()} 🚀              ║
        </Text>
      </Box>
      <Box justifyContent="center">
        <Text color="cyan" bold>
          ║              Lead Full Stack Engineer                  ║
        </Text>
      </Box>
      <Box justifyContent="center" paddingY={1}>
        <Text color="cyan" bold>
          ╚══════════════════════════════════════════════════════════╝
        </Text>
      </Box>
      
      {/* Decorative separator */}
      <Box justifyContent="center" marginTop={1}>
        <Text color="gray" dimColor>
          {'═'.repeat(60)}
        </Text>
      </Box>
    </Box>
  );
});

Header.displayName = 'Header';

export default Header;