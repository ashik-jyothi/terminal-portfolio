import { useInput } from 'ink';
import { useCallback, useMemo } from 'react';
import type { SectionType } from '../types/app';

interface UseKeyboardNavigationProps {
  currentSection: SectionType;
  onSectionChange: (section: SectionType) => void;
  onExit?: () => void;
}

export const useKeyboardNavigation = ({ currentSection, onSectionChange, onExit }: UseKeyboardNavigationProps) => {
  // Memoize sections array to prevent recreation on every render
  const sections: SectionType[] = useMemo(() => ['home', 'about', 'experience', 'skills', 'projects', 'contact'], []);

  // Memoize section map to prevent recreation on every render
  const sectionMap = useMemo<Record<string, SectionType>>(() => ({
    '1': 'home',
    '2': 'about',
    '3': 'experience',
    '4': 'skills',
    '5': 'projects',
    '6': 'contact'
  }), []);

  // Optimize navigation functions with useCallback
  const navigateToSection = useCallback((direction: 'next' | 'prev') => {
    const currentIndex = sections.indexOf(currentSection);
    let newIndex: number;

    if (direction === 'next') {
      newIndex = currentIndex < sections.length - 1 ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : sections.length - 1;
    }

    const newSection = sections[newIndex];
    if (newSection !== currentSection) {
      onSectionChange(newSection);
    }
  }, [currentSection, sections, onSectionChange]);

  const navigateToSectionByNumber = useCallback((number: string) => {
    const targetSection = sectionMap[number];
    if (targetSection && targetSection !== currentSection) {
      onSectionChange(targetSection);
    }
  }, [currentSection, sectionMap, onSectionChange]);

  const handleExit = useCallback(() => {
    // Call custom exit handler if provided
    if (onExit) {
      onExit();
    }
    
    // Graceful exit with cleanup
    process.exit(0);
  }, [onExit]);

  // Optimize input handling with memoized callback
  const handleInput = useCallback((input: string, key: any) => {
    // Handle exit commands (q, Ctrl+C) gracefully
    if (key.escape || input === 'q' || (key.ctrl && input === 'c')) {
      handleExit();
      return;
    }

    // Number key shortcuts for quick section access (1-6)
    if (['1', '2', '3', '4', '5', '6'].includes(input)) {
      navigateToSectionByNumber(input);
      return;
    }

    // Arrow key navigation
    if (key.upArrow || key.leftArrow) {
      navigateToSection('prev');
      return;
    }

    if (key.downArrow || key.rightArrow) {
      navigateToSection('next');
      return;
    }

    // Vim-style navigation (hjkl)
    const lowerInput = input.toLowerCase();
    switch (lowerInput) {
      case 'h': // left
      case 'k': // up
        navigateToSection('prev');
        break;
      case 'l': // right  
      case 'j': // down
        navigateToSection('next');
        break;
      case 'g': // go to first section (home)
        if (currentSection !== 'home') {
          onSectionChange('home');
        }
        break;
    }

    // Handle capital G for last section (contact)
    if (input === 'G' && currentSection !== 'contact') {
      onSectionChange('contact');
    }
  }, [handleExit, navigateToSectionByNumber, navigateToSection, currentSection, onSectionChange]);

  useInput(handleInput);
};