/**
 * Data validation functions for portfolio content
 * Ensures data integrity and validates portfolio data structure
 */

import type { 
  PortfolioData, 
  PersonalInfo, 
  SkillCategory, 
  Project, 
  ContactInfo, 
  SocialLink 
} from '../types/portfolio.js';

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates personal information
 */
export function validatePersonalInfo(personal: PersonalInfo): string[] {
  const errors: string[] = [];

  if (!personal.name || personal.name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!personal.title || personal.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!personal.bio || personal.bio.trim().length === 0) {
    errors.push('Bio is required');
  }

  if (!personal.location || personal.location.trim().length === 0) {
    errors.push('Location is required');
  }

  return errors;
}

/**
 * Validates skill categories
 */
export function validateSkillCategories(skills: SkillCategory[]): string[] {
  const errors: string[] = [];

  if (!Array.isArray(skills) || skills.length === 0) {
    errors.push('At least one skill category is required');
    return errors;
  }

  skills.forEach((category, index) => {
    if (!category.category || category.category.trim().length === 0) {
      errors.push(`Skill category ${index + 1}: Category name is required`);
    }

    if (!Array.isArray(category.skills) || category.skills.length === 0) {
      errors.push(`Skill category ${index + 1}: At least one skill is required`);
    } else {
      category.skills.forEach((skill, skillIndex) => {
        if (!skill || skill.trim().length === 0) {
          errors.push(`Skill category ${index + 1}, skill ${skillIndex + 1}: Skill name is required`);
        }
      });
    }
  });

  return errors;
}

/**
 * Validates projects
 */
export function validateProjects(projects: Project[]): string[] {
  const errors: string[] = [];

  if (!Array.isArray(projects) || projects.length === 0) {
    errors.push('At least one project is required');
    return errors;
  }

  projects.forEach((project, index) => {
    if (!project.name || project.name.trim().length === 0) {
      errors.push(`Project ${index + 1}: Name is required`);
    }

    if (!project.description || project.description.trim().length === 0) {
      errors.push(`Project ${index + 1}: Description is required`);
    }

    if (!Array.isArray(project.technologies) || project.technologies.length === 0) {
      errors.push(`Project ${index + 1}: At least one technology is required`);
    }

    if (!Array.isArray(project.highlights) || project.highlights.length === 0) {
      errors.push(`Project ${index + 1}: At least one highlight is required`);
    }

    if (project.githubUrl && !isValidUrl(project.githubUrl)) {
      errors.push(`Project ${index + 1}: Invalid GitHub URL`);
    }

    if (project.liveUrl && !isValidUrl(project.liveUrl)) {
      errors.push(`Project ${index + 1}: Invalid live URL`);
    }
  });

  return errors;
}

/**
 * Validates social links
 */
export function validateSocialLinks(social: SocialLink[]): string[] {
  const errors: string[] = [];

  if (!Array.isArray(social)) {
    errors.push('Social links must be an array');
    return errors;
  }

  social.forEach((link, index) => {
    if (!link.platform || link.platform.trim().length === 0) {
      errors.push(`Social link ${index + 1}: Platform is required`);
    }

    if (!link.url || !isValidUrl(link.url)) {
      errors.push(`Social link ${index + 1}: Valid URL is required`);
    }

    if (!link.username || link.username.trim().length === 0) {
      errors.push(`Social link ${index + 1}: Username is required`);
    }
  });

  return errors;
}

/**
 * Validates contact information
 */
export function validateContactInfo(contact: ContactInfo): string[] {
  const errors: string[] = [];

  if (!contact.email || !isValidEmail(contact.email)) {
    errors.push('Valid email address is required');
  }

  if (contact.website && !isValidUrl(contact.website)) {
    errors.push('Invalid website URL');
  }

  errors.push(...validateSocialLinks(contact.social));

  return errors;
}

/**
 * Validates complete portfolio data
 */
export function validatePortfolioData(data: PortfolioData): string[] {
  const errors: string[] = [];

  if (!data) {
    errors.push('Portfolio data is required');
    return errors;
  }

  errors.push(...validatePersonalInfo(data.personal));
  errors.push(...validateSkillCategories(data.skills));
  errors.push(...validateProjects(data.projects));
  errors.push(...validateContactInfo(data.contact));

  return errors;
}

/**
 * Type guard to check if data is valid PortfolioData
 */
export function isValidPortfolioData(data: unknown): data is PortfolioData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const portfolioData = data as PortfolioData;
  const errors = validatePortfolioData(portfolioData);
  return errors.length === 0;
}