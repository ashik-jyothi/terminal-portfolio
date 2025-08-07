import React from 'react';
import { Box, Text } from 'ink';
import type { HeaderProps } from '../types/app';

const Header: React.FC<HeaderProps> = React.memo(({ title: _ = "Terminal Portfolio" }) => {
  // Calculate the box width based on content
  const headerText = "🚀 ASHIK JYOTHI'S PORTFOLIO 🚀";
  const subtitleText = "Lead Full Stack Engineer";
  const maxLength = Math.max(headerText.length, subtitleText.length) + 4; // Add padding
  const boxWidth = Math.max(56, maxLength); // Minimum width of 56
  
  const topBorder = '╔' + '═'.repeat(boxWidth - 2) + '╗';
  const bottomBorder = '╚' + '═'.repeat(boxWidth - 2) + '╝';
  
  // Center text within the box
  const centerText = (text: string) => {
    const padding = Math.max(0, boxWidth - text.length - 2);
    const leftPad = Math.floor(padding / 2);
    const rightPad = padding - leftPad;
    return '║' + ' '.repeat(leftPad) + text + ' '.repeat(rightPad) + '║';
  };
  
  return (
    <Box flexDirection="column" marginBottom={1}>
      {/* ASCII Art Header with dynamic sizing */}
      <Box justifyContent="center" paddingY={1}>
        <Text color="cyan" bold>
          {topBorder}
        </Text>
      </Box>
      <Box justifyContent="center">
        <Text color="cyan" bold>
          {centerText(headerText)}
        </Text>
      </Box>
      <Box justifyContent="center">
        <Text color="cyan" bold>
          {centerText(subtitleText)}
        </Text>
      </Box>
      <Box justifyContent="center" paddingY={1}>
        <Text color="cyan" bold>
          {bottomBorder}
        </Text>
      </Box>
      
      {/* Decorative separator */}
      <Box justifyContent="center" marginTop={1}>
        <Text color="gray" dimColor>
          {'═'.repeat(boxWidth)}
        </Text>
      </Box>
    </Box>
  );
});

Header.displayName = 'Header';

export default Header;