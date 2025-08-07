/**
 * Type definitions index
 * Re-exports all type definitions for easier importing
 */

// Portfolio data types
export type {
  PersonalInfo,
  SkillCategory,
  Project,
  SocialLink,
  ContactInfo,
  PortfolioData
} from './portfolio';

// Application state and navigation types
export type {
  SectionType,
  TerminalDimensions,
  AppState,
  NavigationProps,
  HeaderProps,
  ContainerProps,
  SectionProps
} from './app';

// Validation functions
export {
  isValidEmail,
  isValidUrl,
  validatePersonalInfo,
  validateSkillCategories,
  validateProjects,
  validateSocialLinks,
  validateContactInfo,
  validatePortfolioData,
  isValidPortfolioData
} from '../utils/validation';