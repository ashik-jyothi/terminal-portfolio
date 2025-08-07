/**
 * Utils Integration Tests
 * Tests for utility functions and their integration
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  detectTerminalCapabilities,
  getFallbackChars,
  validateTerminalDimensions,
  safeColor
} from '../terminalCapabilities';

import {
  isValidEmail,
  isValidUrl,
  validatePersonalInfo,
  validateSkillCategories,
  validatePortfolioData,
  isValidPortfolioData
} from '../validation';

import SessionManager, { getSessionManager, initializeSessionManager } from '../sessionManager';

import type { PortfolioData, PersonalInfo, SkillCategory } from '../../types/portfolio';

describe('Utils Integration Tests', () => {
  describe('Terminal Capabilities', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      vi.resetModules();
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    describe('detectTerminalCapabilities', () => {
      it('should detect color support based on TERM environment', () => {
        process.env.TERM = 'xterm-256color';
        const capabilities = detectTerminalCapabilities();
        expect(capabilities.supportsColor).toBe(true);
      });

      it('should disable color when NO_COLOR is set', () => {
        process.env.NO_COLOR = '1';
        process.env.TERM = 'xterm-256color';
        const capabilities = detectTerminalCapabilities();
        expect(capabilities.supportsColor).toBe(false);
      });

      it('should detect unicode support based on LANG', () => {
        process.env.LANG = 'en_US.UTF-8';
        const capabilities = detectTerminalCapabilities();
        expect(capabilities.supportsUnicode).toBe(true);
      });

      it('should disable unicode for non-UTF locales', () => {
        process.env.LANG = 'C';
        const capabilities = detectTerminalCapabilities();
        expect(capabilities.supportsUnicode).toBe(false);
      });

      it('should disable features for dumb terminals', () => {
        process.env.TERM = 'dumb';
        const capabilities = detectTerminalCapabilities();
        expect(capabilities.supportsBorders).toBe(false);
        expect(capabilities.supportsUnicode).toBe(false);
      });

      it('should provide default capabilities', () => {
        delete process.env.TERM;
        delete process.env.LANG;
        delete process.env.NO_COLOR;
        
        const capabilities = detectTerminalCapabilities();
        expect(capabilities).toHaveProperty('supportsColor');
        expect(capabilities).toHaveProperty('supportsUnicode');
        expect(capabilities).toHaveProperty('supportsBorders');
        expect(capabilities).toHaveProperty('supportsResize');
        expect(capabilities).toHaveProperty('minWidth');
        expect(capabilities).toHaveProperty('minHeight');
      });
    });

    describe('getFallbackChars', () => {
      it('should return unicode characters when supported', () => {
        const capabilities = { supportsUnicode: true } as any;
        const chars = getFallbackChars(capabilities);
        expect(chars.horizontal).toBe('─');
        expect(chars.bullet).toBe('▶');
        expect(chars.dot).toBe('·');
      });

      it('should return ASCII fallbacks when unicode not supported', () => {
        const capabilities = { supportsUnicode: false } as any;
        const chars = getFallbackChars(capabilities);
        expect(chars.horizontal).toBe('-');
        expect(chars.bullet).toBe('>');
        expect(chars.dot).toBe('.');
      });

      it('should provide all required characters', () => {
        const capabilities = { supportsUnicode: true } as any;
        const chars = getFallbackChars(capabilities);
        
        expect(chars).toHaveProperty('bullet');
        expect(chars).toHaveProperty('horizontal');
        expect(chars).toHaveProperty('dot');
        expect(chars).toHaveProperty('warning');
        expect(chars).toHaveProperty('error');
        expect(chars).toHaveProperty('success');
        expect(chars).toHaveProperty('arrow');
      });
    });

    describe('validateTerminalDimensions', () => {
      it('should enforce minimum dimensions', () => {
        const capabilities = { minWidth: 60, minHeight: 20 } as any;
        const result = validateTerminalDimensions(40, 15, capabilities);
        
        expect(result.width).toBe(60);
        expect(result.height).toBe(20);
        expect(result.isTooSmall).toBe(true);
      });

      it('should preserve valid dimensions', () => {
        const capabilities = { minWidth: 60, minHeight: 20 } as any;
        const result = validateTerminalDimensions(80, 24, capabilities);
        
        expect(result.width).toBe(80);
        expect(result.height).toBe(24);
        expect(result.isTooSmall).toBe(false);
      });

      it('should provide warning messages for small dimensions', () => {
        const capabilities = { minWidth: 60, minHeight: 20 } as any;
        const result = validateTerminalDimensions(40, 15, capabilities);
        
        expect(result.warnings.width).toContain('below minimum');
        expect(result.warnings.height).toContain('below minimum');
      });

      it('should handle edge cases', () => {
        const capabilities = { minWidth: 60, minHeight: 20 } as any;
        
        // Test with zero dimensions
        const result1 = validateTerminalDimensions(0, 0, capabilities);
        expect(result1.width).toBe(60);
        expect(result1.height).toBe(20);
        
        // Test with negative dimensions
        const result2 = validateTerminalDimensions(-10, -5, capabilities);
        expect(result2.width).toBe(60);
        expect(result2.height).toBe(20);
      });
    });

    describe('safeColor', () => {
      it('should return text unchanged when color not supported', () => {
        const capabilities = { supportsColor: false } as any;
        const result = safeColor('test', 'red', capabilities);
        expect(result).toBe('test');
      });

      it('should return text unchanged when color supported (Ink handles coloring)', () => {
        const capabilities = { supportsColor: true } as any;
        const result = safeColor('test', 'red', capabilities);
        expect(result).toBe('test');
      });
    });
  });

  describe('Validation Functions', () => {
    describe('Email Validation', () => {
      it('should validate correct email addresses', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
        expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
        expect(isValidEmail('user+tag@example.org')).toBe(true);
      });

      it('should reject invalid email addresses', () => {
        expect(isValidEmail('invalid-email')).toBe(false);
        expect(isValidEmail('@example.com')).toBe(false);
        expect(isValidEmail('test@')).toBe(false);
        expect(isValidEmail('')).toBe(false);
      });
    });

    describe('URL Validation', () => {
      it('should validate correct URLs', () => {
        expect(isValidUrl('https://github.com/user/repo')).toBe(true);
        expect(isValidUrl('http://example.com')).toBe(true);
        expect(isValidUrl('https://subdomain.example.com/path')).toBe(true);
      });

      it('should reject invalid URLs', () => {
        expect(isValidUrl('not-a-url')).toBe(false);
        expect(isValidUrl('ftp://example.com')).toBe(false);
        expect(isValidUrl('')).toBe(false);
      });
    });

    describe('Personal Info Validation', () => {
      it('should validate correct personal info', () => {
        const validPersonal: PersonalInfo = {
          name: 'John Doe',
          title: 'Software Developer',
          bio: 'Experienced developer with passion for coding',
          location: 'San Francisco, CA'
        };

        const errors = validatePersonalInfo(validPersonal);
        expect(errors).toHaveLength(0);
      });

      it('should detect missing required fields', () => {
        const invalidPersonal: PersonalInfo = {
          name: '',
          title: 'Developer',
          bio: '',
          location: 'San Francisco'
        };

        const errors = validatePersonalInfo(invalidPersonal);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some(error => error.includes('name'))).toBe(true);
        expect(errors.some(error => error.includes('bio'))).toBe(true);
      });

      it('should validate field lengths', () => {
        const invalidPersonal: PersonalInfo = {
          name: 'A'.repeat(101), // Too long
          title: 'Developer',
          bio: 'Short bio',
          location: 'Location'
        };

        const errors = validatePersonalInfo(invalidPersonal);
        expect(errors.some(error => error.includes('name') && error.includes('long'))).toBe(true);
      });
    });

    describe('Skill Categories Validation', () => {
      it('should validate correct skill categories', () => {
        const validSkills: SkillCategory[] = [
          { category: 'Frontend', skills: ['React', 'TypeScript'] },
          { category: 'Backend', skills: ['Node.js', 'Python'] }
        ];

        const errors = validateSkillCategories(validSkills);
        expect(errors).toHaveLength(0);
      });

      it('should detect empty categories and skills', () => {
        const invalidSkills: SkillCategory[] = [
          { category: '', skills: [] },
          { category: 'Backend', skills: [''] }
        ];

        const errors = validateSkillCategories(invalidSkills);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some(error => error.includes('category'))).toBe(true);
        expect(errors.some(error => error.includes('skills'))).toBe(true);
      });
    });

    describe('Complete Portfolio Validation', () => {
      it('should validate complete portfolio data', () => {
        const validPortfolio: PortfolioData = {
          personal: {
            name: 'John Doe',
            title: 'Developer',
            bio: 'Experienced developer',
            location: 'San Francisco'
          },
          skills: [
            { category: 'Frontend', skills: ['React', 'TypeScript'] }
          ],
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

        const errors = validatePortfolioData(validPortfolio);
        expect(errors).toHaveLength(0);
        expect(isValidPortfolioData(validPortfolio)).toBe(true);
      });

      it('should detect validation errors across all sections', () => {
        const invalidPortfolio: PortfolioData = {
          personal: {
            name: '', // Invalid
            title: 'Developer',
            bio: '',  // Invalid
            location: 'Location'
          },
          skills: [
            { category: '', skills: [] } // Invalid
          ],
          projects: [{
            name: '', // Invalid
            description: 'Description',
            technologies: [],
            highlights: []
          }],
          contact: {
            email: 'invalid-email', // Invalid
            social: []
          }
        };

        const errors = validatePortfolioData(invalidPortfolio);
        expect(errors.length).toBeGreaterThan(0);
        expect(isValidPortfolioData(invalidPortfolio)).toBe(false);
      });
    });
  });

  describe('Session Manager', () => {
    let sessionManager: SessionManager;

    beforeEach(() => {
      sessionManager = new SessionManager({
        enableLogging: false, // Disable logging for cleaner tests
        maxSessions: 5,
        sessionTimeout: 1000 // 1 second for testing
      });
    });

    afterEach(async () => {
      await sessionManager.shutdown();
    });

    describe('Session Creation and Management', () => {
      it('should create sessions with unique IDs', () => {
        const sessionId1 = sessionManager.createSession();
        const sessionId2 = sessionManager.createSession();
        
        expect(sessionId1).toBeDefined();
        expect(sessionId2).toBeDefined();
        expect(sessionId1).not.toBe(sessionId2);
        
        const session1 = sessionManager.getSession(sessionId1);
        const session2 = sessionManager.getSession(sessionId2);
        
        expect(session1).toBeDefined();
        expect(session2).toBeDefined();
        expect(session1?.id).toBe(sessionId1);
        expect(session2?.id).toBe(sessionId2);
      });

      it('should create sessions with custom IDs', () => {
        const customId = 'custom-session-123';
        const sessionId = sessionManager.createSession(customId);
        
        expect(sessionId).toBe(customId);
        
        const session = sessionManager.getSession(sessionId);
        expect(session?.id).toBe(customId);
      });

      it('should track session activity', () => {
        const sessionId = sessionManager.createSession();
        const initialSession = sessionManager.getSession(sessionId);
        
        sessionManager.updateActivity(sessionId, 'about');
        
        const updatedSession = sessionManager.getSession(sessionId);
        expect(updatedSession?.sectionsVisited).toContain('about');
        expect(updatedSession?.lastActivity.getTime()).toBeGreaterThanOrEqual(
          initialSession!.lastActivity.getTime()
        );
      });

      it('should track unique sections visited', () => {
        const sessionId = sessionManager.createSession();
        
        sessionManager.updateActivity(sessionId, 'about');
        sessionManager.updateActivity(sessionId, 'skills');
        sessionManager.updateActivity(sessionId, 'about'); // duplicate
        
        const session = sessionManager.getSession(sessionId);
        expect(session?.sectionsVisited).toEqual(['about', 'skills']);
      });

      it('should update terminal size', () => {
        const sessionId = sessionManager.createSession();
        const terminalSize = { width: 120, height: 40 };
        
        sessionManager.updateTerminalSize(sessionId, terminalSize);
        
        const session = sessionManager.getSession(sessionId);
        expect(session?.terminalSize).toEqual(terminalSize);
      });
    });

    describe('Session Statistics', () => {
      it('should provide accurate statistics', () => {
        const sessionId1 = sessionManager.createSession();
        const sessionId2 = sessionManager.createSession();
        
        sessionManager.updateActivity(sessionId1, 'about');
        sessionManager.updateActivity(sessionId1, 'skills');
        sessionManager.updateActivity(sessionId2, 'about');
        
        const stats = sessionManager.getStats();
        
        expect(stats.activeSessions).toBe(2);
        expect(stats.totalSessions).toBe(2);
        expect(stats.mostVisitedSections).toContainEqual({
          section: 'about',
          count: 2
        });
      });
    });

    describe('Session Cleanup', () => {
      it('should end sessions manually', () => {
        const sessionId = sessionManager.createSession();
        
        sessionManager.endSession(sessionId, 'disconnect');
        
        const session = sessionManager.getSession(sessionId);
        expect(session).toBeUndefined();
      });

      it('should handle graceful shutdown', async () => {
        const sessionId1 = sessionManager.createSession();
        const sessionId2 = sessionManager.createSession();
        
        expect(sessionManager.getActiveSessions()).toHaveLength(2);
        
        await sessionManager.shutdown();
        
        expect(sessionManager.getActiveSessions()).toHaveLength(0);
      });
    });

    describe('Error Handling', () => {
      it('should handle non-existent session updates gracefully', () => {
        expect(() => {
          sessionManager.updateActivity('non-existent-session', 'about');
        }).not.toThrow();
      });

      it('should prevent session creation during shutdown', async () => {
        await sessionManager.shutdown();
        
        expect(() => {
          sessionManager.createSession();
        }).toThrow('Session manager is shutting down');
      });
    });

    describe('Global Session Manager', () => {
      afterEach(async () => {
        const manager = getSessionManager();
        await manager.shutdown();
      });

      it('should return singleton instance', () => {
        const manager1 = getSessionManager();
        const manager2 = getSessionManager();
        
        expect(manager1).toBe(manager2);
      });

      it('should initialize new instance', () => {
        const manager1 = getSessionManager();
        const manager2 = initializeSessionManager();
        
        expect(manager1).not.toBe(manager2);
      });
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete terminal setup workflow', () => {
      // Detect capabilities
      const capabilities = detectTerminalCapabilities();
      expect(capabilities).toBeDefined();
      
      // Get fallback characters
      const chars = getFallbackChars(capabilities);
      expect(chars).toBeDefined();
      
      // Validate dimensions
      const dimensions = validateTerminalDimensions(80, 24, capabilities);
      expect(dimensions.width).toBe(80);
      expect(dimensions.height).toBe(24);
      
      // Apply safe coloring
      const coloredText = safeColor('test', 'red', capabilities);
      expect(coloredText).toBe('test');
    });

    it('should handle complete portfolio validation workflow', () => {
      const portfolio: PortfolioData = {
        personal: {
          name: 'Test User',
          title: 'Developer',
          bio: 'Test bio',
          location: 'Test Location'
        },
        skills: [
          { category: 'Frontend', skills: ['React'] }
        ],
        projects: [{
          name: 'Test Project',
          description: 'Test description',
          technologies: ['React'],
          highlights: ['Feature 1']
        }],
        contact: {
          email: 'test@example.com',
          social: [{
            platform: 'GitHub',
            url: 'https://github.com/test',
            username: 'test'
          }]
        }
      };

      // Validate individual components
      expect(validatePersonalInfo(portfolio.personal)).toHaveLength(0);
      expect(validateSkillCategories(portfolio.skills)).toHaveLength(0);
      
      // Validate complete portfolio
      expect(validatePortfolioData(portfolio)).toHaveLength(0);
      expect(isValidPortfolioData(portfolio)).toBe(true);
    });
  });
});