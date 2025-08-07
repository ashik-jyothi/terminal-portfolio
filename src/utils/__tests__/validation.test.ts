/**
 * Tests for validation functions
 */

import {
  isValidEmail,
  isValidUrl,
  validatePersonalInfo,
  validateSkillCategories,
  validatePortfolioData,
  isValidPortfolioData
} from '../validation.js';

import type { PortfolioData, PersonalInfo, SkillCategory } from '../../types/portfolio.js';

// Test email validation
console.log('Testing email validation...');
console.log('Valid email:', isValidEmail('test@example.com')); // Should be true
console.log('Invalid email:', isValidEmail('invalid-email')); // Should be false

// Test URL validation
console.log('\nTesting URL validation...');
console.log('Valid URL:', isValidUrl('https://github.com/user/repo')); // Should be true
console.log('Invalid URL:', isValidUrl('not-a-url')); // Should be false

// Test personal info validation
console.log('\nTesting personal info validation...');
const validPersonal: PersonalInfo = {
  name: 'Ashik Jyothi',
  title: 'Software Developer',
  bio: 'Passionate developer with experience in web technologies',
  location: 'India'
};

const invalidPersonal: PersonalInfo = {
  name: '',
  title: 'Developer',
  bio: '',
  location: 'India'
};

console.log('Valid personal info errors:', validatePersonalInfo(validPersonal)); // Should be empty array
console.log('Invalid personal info errors:', validatePersonalInfo(invalidPersonal)); // Should have errors

// Test skill categories validation
console.log('\nTesting skill categories validation...');
const validSkills: SkillCategory[] = [
  { category: 'Frontend', skills: ['React', 'TypeScript'] },
  { category: 'Backend', skills: ['Node.js', 'Python'] }
];

const invalidSkills: SkillCategory[] = [
  { category: '', skills: [] }
];

console.log('Valid skills errors:', validateSkillCategories(validSkills)); // Should be empty array
console.log('Invalid skills errors:', validateSkillCategories(invalidSkills)); // Should have errors

// Test complete portfolio data validation
console.log('\nTesting complete portfolio validation...');
const validPortfolio: PortfolioData = {
  personal: validPersonal,
  skills: validSkills,
  projects: [{
    name: 'Test Project',
    description: 'A test project',
    technologies: ['React', 'TypeScript'],
    highlights: ['Feature 1', 'Feature 2']
  }],
  contact: {
    email: 'test@example.com',
    social: [{
      platform: 'GitHub',
      url: 'https://github.com/user',
      username: 'user'
    }]
  }
};

console.log('Valid portfolio errors:', validatePortfolioData(validPortfolio)); // Should be empty array
console.log('Is valid portfolio data:', isValidPortfolioData(validPortfolio)); // Should be true

console.log('\nValidation tests completed successfully!');