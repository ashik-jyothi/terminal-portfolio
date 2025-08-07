import React, { useMemo } from 'react';
import { Box, Text } from 'ink';
import type { SectionType } from '../types/app';
import ErrorBoundary from './ErrorBoundary';
import { detectTerminalCapabilities, getFallbackChars } from '../utils/terminalCapabilities';

// Import section components directly for now to maintain test compatibility
// TODO: Re-enable lazy loading after test environment supports it
import AboutSection from './AboutSection';
import ExperienceSection from './ExperienceSection';
import SkillsSection from './SkillsSection';
import ProjectsSection from './ProjectsSection';
import ContactSection from './ContactSection';

interface OptimizedSectionRendererProps {
  currentSection: SectionType;
}

// Optimized loading component with better visual feedback
const SectionLoadingFallback: React.FC<{ sectionName: string }> = React.memo(({ sectionName }) => {
  const capabilities = detectTerminalCapabilities();
  const fallbackChars = getFallbackChars(capabilities);
  
  return (
    <Box flexDirection="column" alignItems="center" justifyContent="center" padding={2}>
      <Box marginBottom={1}>
        <Text color={capabilities.supportsColor ? "yellow" : undefined}>
          {fallbackChars.loading} Loading {sectionName}...
        </Text>
      </Box>
      <Box>
        <Text dimColor>
          {fallbackChars.dot.repeat(3)} Please wait {fallbackChars.dot.repeat(3)}
        </Text>
      </Box>
    </Box>
  );
});

SectionLoadingFallback.displayName = 'SectionLoadingFallback';

// Optimized error fallback with better error handling
const SectionErrorFallback: React.FC<{ sectionName: string; error?: Error }> = React.memo(({ sectionName, error }) => {
  const capabilities = detectTerminalCapabilities();
  const fallbackChars = getFallbackChars(capabilities);
  
  return (
    <Box flexDirection="column" alignItems="center" justifyContent="center" padding={2}>
      <Box marginBottom={1}>
        <Text color={capabilities.supportsColor ? "red" : undefined} bold>
          {fallbackChars.error} Failed to load {sectionName}
        </Text>
      </Box>
      
      {error && (
        <Box marginBottom={2}>
          <Text color={capabilities.supportsColor ? "gray" : undefined} dimColor>
            Error: {error.message}
          </Text>
        </Box>
      )}
      
      <Box marginBottom={1}>
        <Text dimColor>
          This might be due to:
        </Text>
      </Box>
      
      <Box flexDirection="column" marginLeft={2} marginBottom={2}>
        <Text dimColor>{fallbackChars.bullet} Component loading failure</Text>
        <Text dimColor>{fallbackChars.bullet} Memory constraints</Text>
        <Text dimColor>{fallbackChars.bullet} Terminal compatibility issues</Text>
      </Box>
      
      <Box>
        <Text color={capabilities.supportsColor ? "cyan" : undefined}>
          Try navigating to a different section or restart the application.
        </Text>
      </Box>
    </Box>
  );
});

SectionErrorFallback.displayName = 'SectionErrorFallback';

// Home section component (always loaded, no lazy loading needed)
const HomeSection: React.FC = React.memo(() => {
  const capabilities = detectTerminalCapabilities();
  const fallbackChars = getFallbackChars(capabilities);
  
  return (
    <Box flexDirection="column" padding={2}>
      <Box marginBottom={2}>
        <Text color={capabilities.supportsColor ? "green" : undefined} bold>
          {fallbackChars.success} Welcome to the Terminal Portfolio!
        </Text>
      </Box>
      
      <Box flexDirection="column" marginBottom={2}>
        <Text>
          Navigate through different sections to explore:
        </Text>
        <Box marginTop={1} paddingLeft={2}>
          <Text>{fallbackChars.bullet} About - Personal introduction and background</Text>
          <Text>{fallbackChars.bullet} Experience - Professional work history and achievements</Text>
          <Text>{fallbackChars.bullet} Skills - Technical expertise and capabilities</Text>
          <Text>{fallbackChars.bullet} Projects - Portfolio of work and achievements</Text>
          <Text>{fallbackChars.bullet} Contact - Ways to connect and collaborate</Text>
        </Box>
      </Box>
      
      <Box marginBottom={2}>
        <Text color={capabilities.supportsColor ? "yellow" : undefined}>
          Navigation Tips:
        </Text>
        <Box marginTop={1} paddingLeft={2}>
          <Text dimColor>{fallbackChars.bullet} Use arrow keys or vim keys (hjkl) to navigate</Text>
          <Text dimColor>{fallbackChars.bullet} Press numbers 1-6 for quick section access</Text>
          <Text dimColor>{fallbackChars.bullet} Press 'g' to return home, 'G' for contact</Text>
          <Text dimColor>{fallbackChars.bullet} Press 'q', ESC, or Ctrl+C to exit</Text>
        </Box>
      </Box>
      
      <Box>
        <Text color={capabilities.supportsColor ? "cyan" : undefined} dimColor>
          {fallbackChars.sparkle} Optimized for performance and smooth navigation {fallbackChars.sparkle}
        </Text>
      </Box>
    </Box>
  );
});

HomeSection.displayName = 'HomeSection';

const OptimizedSectionRenderer: React.FC<OptimizedSectionRendererProps> = React.memo(({ currentSection }) => {
  // Memoize section component selection to prevent unnecessary re-renders
  const SectionComponent = useMemo(() => {
    switch (currentSection) {
      case 'home':
        return HomeSection;
      case 'about':
        return AboutSection;
      case 'experience':
        return ExperienceSection;
      case 'skills':
        return SkillsSection;
      case 'projects':
        return ProjectsSection;
      case 'contact':
        return ContactSection;
      default:
        return HomeSection;
    }
  }, [currentSection]);

  // For home section, no lazy loading needed
  if (currentSection === 'home') {
    return (
      <ErrorBoundary
        fallback={<SectionErrorFallback sectionName={currentSection} />}
        onError={(error) => console.error(`Error in ${currentSection} section:`, error)}
      >
        <SectionComponent />
      </ErrorBoundary>
    );
  }

  // For other sections, render directly with error boundary
  return (
    <ErrorBoundary
      fallback={<SectionErrorFallback sectionName={currentSection} />}
      onError={(error) => console.error(`Error in ${currentSection} section:`, error)}
    >
      <SectionComponent />
    </ErrorBoundary>
  );
});

OptimizedSectionRenderer.displayName = 'OptimizedSectionRenderer';

export default OptimizedSectionRenderer;