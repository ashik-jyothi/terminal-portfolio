/**
 * Application state and navigation types
 * Defines the structure for app state management and navigation
 */

export type SectionType = 'home' | 'about' | 'experience' | 'skills' | 'projects' | 'contact';

export interface TerminalDimensions {
  width: number;
  height: number;
}

export interface AppState {
  currentSection: SectionType;
  terminalDimensions: TerminalDimensions;
  isLoading: boolean;
}

export interface NavigationProps {
  currentSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

export interface HeaderProps {
  title?: string;
}

export interface ContainerProps {
  children: React.ReactNode;
  padding?: number;
}

export interface SectionProps {
  title: string;
  children: React.ReactNode;
}