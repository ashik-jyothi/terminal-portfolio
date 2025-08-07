/**
 * Test sample portfolio data validation
 */

import { samplePortfolioData } from '../sample-portfolio.js';
import { validatePortfolioData, isValidPortfolioData } from '../../utils/validation.js';

console.log('Testing sample portfolio data...');

const errors = validatePortfolioData(samplePortfolioData);
console.log('Validation errors:', errors);

const isValid = isValidPortfolioData(samplePortfolioData);
console.log('Is valid portfolio data:', isValid);

if (errors.length === 0 && isValid) {
  console.log('✅ Sample portfolio data is valid!');
} else {
  console.log('❌ Sample portfolio data has validation errors');
}

console.log('\nPortfolio structure:');
console.log('- Personal info:', !!samplePortfolioData.personal);
console.log('- Skills categories:', samplePortfolioData.skills.length);
console.log('- Projects:', samplePortfolioData.projects.length);
console.log('- Contact info:', !!samplePortfolioData.contact);
console.log('- Social links:', samplePortfolioData.contact.social.length);