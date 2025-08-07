import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';
import {
  detectTerminalCapabilities,
  getFallbackChars,
  validateTerminalDimensions,
  safeColor
} from '../terminalCapabilities';

describe('terminalCapabilities', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
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
  });

  describe('getFallbackChars', () => {
    it('should return unicode characters when supported', () => {
      const capabilities = { supportsUnicode: true } as any;
      const chars = getFallbackChars(capabilities);
      expect(chars.horizontal).toBe('─');
      expect(chars.bullet).toBe('▶');
    });

    it('should return ASCII fallbacks when unicode not supported', () => {
      const capabilities = { supportsUnicode: false } as any;
      const chars = getFallbackChars(capabilities);
      expect(chars.horizontal).toBe('-');
      expect(chars.bullet).toBe('>');
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