# Type Definitions

This directory contains all TypeScript type definitions for the terminal portfolio application.

## Files

### `portfolio.ts`
Defines the core data structures for portfolio content:
- `PersonalInfo`: Personal information (name, title, bio, location)
- `SkillCategory`: Skill categories with associated skills
- `Project`: Project information with technologies and links
- `SocialLink`: Social media platform links
- `ContactInfo`: Contact information including email and social links
- `PortfolioData`: Complete portfolio data structure

### `app.ts`
Defines application state and component prop types:
- `SectionType`: Navigation section types
- `TerminalDimensions`: Terminal size information
- `AppState`: Global application state
- Component prop interfaces for consistent typing

### `index.ts`
Re-exports all types for convenient importing throughout the application.

## Validation

The `src/utils/validation.ts` file provides comprehensive validation functions for all portfolio data types:

- Email and URL format validation
- Individual data structure validation
- Complete portfolio data validation
- Type guards for runtime type checking

## Usage

```typescript
import type { PortfolioData, SectionType } from '../types';
import { validatePortfolioData, isValidPortfolioData } from '../utils/validation';

// Use types for component props
interface MyComponentProps {
  data: PortfolioData;
  currentSection: SectionType;
}

// Validate data at runtime
const errors = validatePortfolioData(portfolioData);
if (errors.length === 0) {
  // Data is valid
}
```

## Requirements Coverage

This implementation covers the following requirements:
- **3.1**: Technical skills organized by categories (SkillCategory interface)
- **3.2**: Project information with descriptions and technologies (Project interface)
- **3.3**: Repository and demo links for projects (Project.githubUrl, Project.liveUrl)
- **4.1**: Contact information display (ContactInfo interface)
- **4.2**: Social media links (SocialLink interface)
- **4.3**: Interactive/copyable links support (URL validation)