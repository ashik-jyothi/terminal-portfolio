/**
 * Core data models for the terminal portfolio application
 * Defines the structure for portfolio content and data validation
 */

export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  location: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface WorkExperience {
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string;
  achievements: string[];
  technologies?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  duration: string;
  field?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  highlights: string[];
}

export interface SocialLink {
  platform: string;
  url: string;
  username: string;
}

export interface ContactInfo {
  email: string;
  social: SocialLink[];
  website?: string;
}

export interface PortfolioData {
  personal: PersonalInfo;
  experience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  skills: SkillCategory[];
  projects: Project[];
  contact: ContactInfo;
}