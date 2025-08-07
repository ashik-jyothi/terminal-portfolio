import React from 'react';
import { Box, Text } from 'ink';
import type { NavigationProps, SectionType } from '../types/app';
import { detectTerminalCapabilities, getFallbackChars } from '../utils/terminalCapabilities';

const Navigation: React.FC<NavigationProps> = React.memo(({ currentSection, onSectionChange: _ }) => {
  // onSectionChange is handled by the keyboard navigation hook
  const capabilities = detectTerminalCapabilities();
  const fallbackChars = getFallbackChars(capabilities);
  
  // Define navigation menu items
  const menuItems: Array<{ key: string; section: SectionType; label: string }> = [
    { key: '1', section: 'home', label: 'Home' },
    { key: '2', section: 'about', label: 'About' },
    { key: '3', section: 'experience', label: 'Experience' },
    { key: '4', section: 'skills', label: 'Skills' },
    { key: '5', section: 'projects', label: 'Projects' },
    { key: '6', section: 'contact', label: 'Contact' }
  ];

  return (
    <Box flexDirection="column" alignItems="center">
      {/* Navigation instructions */}
      <Box justifyContent="center" marginBottom={1}>
        <Text dimColor>
          Navigation: Arrow keys, vim (hjkl), numbers (1-6) | 'g' (home), 'G' (contact) | 'q'/ESC/Ctrl+C to exit
        </Text>
      </Box>

      {/* Current section indicator with highlighting */}
      <Box justifyContent="center" marginBottom={1}>
        <Text>
          Current Section: <Text bold color={capabilities.supportsColor ? "green" : undefined}>
            {currentSection.toUpperCase()}
          </Text>
        </Text>
      </Box>

      {/* Main menu with section options */}
      <Box justifyContent="center" marginBottom={2}>
        {menuItems.map((item, index) => {
          const isActive = item.section === currentSection;
          const separator = index < menuItems.length - 1 ? ' | ' : '';
          
          return (
            <Text key={item.section}>
              <Text 
                color={capabilities.supportsColor ? (isActive ? 'green' : 'white') : undefined} 
                bold={isActive}
              >
                [{item.key}] {item.label}
              </Text>
              <Text dimColor>{separator}</Text>
            </Text>
          );
        })}
      </Box>

      {/* Visual indicator for current section */}
      <Box justifyContent="center">
        <Text color={capabilities.supportsColor ? "cyan" : undefined}>
          {`${fallbackChars.bullet} `.repeat(menuItems.findIndex(item => item.section === currentSection) + 1)}
          <Text bold>You are here</Text>
          {` ${fallbackChars.arrow}`.repeat(menuItems.length - menuItems.findIndex(item => item.section === currentSection))}
        </Text>
      </Box>
    </Box>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;