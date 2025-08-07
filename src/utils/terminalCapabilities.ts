/**
 * Terminal capabilities detection and fallback handling
 * Provides graceful degradation for unsupported terminal features
 */

export interface TerminalCapabilities {
  supportsColor: boolean;
  supportsUnicode: boolean;
  supportsBorders: boolean;
  supportsResize: boolean;
  minWidth: number;
  minHeight: number;
}

/**
 * Detect terminal capabilities based on environment and stdout
 */
export const detectTerminalCapabilities = (): TerminalCapabilities => {
  const capabilities: TerminalCapabilities = {
    supportsColor: true,
    supportsUnicode: true,
    supportsBorders: true,
    supportsResize: true,
    minWidth: 60,
    minHeight: 20
  };

  // Check for color support
  const colorTerms = ['xterm', 'xterm-color', 'xterm-256color', 'screen', 'screen-256color'];
  const term = process.env.TERM || '';
  const colorForced = process.env.FORCE_COLOR;
  const noColor = process.env.NO_COLOR;

  if (noColor || (!colorForced && !colorTerms.some(t => term.includes(t)))) {
    capabilities.supportsColor = false;
  }

  // Check for Unicode support
  const encoding = process.env.LANG || process.env.LC_ALL || '';
  if (!encoding.toLowerCase().includes('utf')) {
    capabilities.supportsUnicode = false;
  }

  // Basic terminal detection for borders
  if (term.includes('dumb') || process.env.CI) {
    capabilities.supportsBorders = false;
    capabilities.supportsUnicode = false;
  }

  // Check if resize events are supported
  if (!process.stdout.isTTY) {
    capabilities.supportsResize = false;
  }

  return capabilities;
};

/**
 * Get fallback characters for unsupported terminals
 */
export const getFallbackChars = (capabilities: TerminalCapabilities) => {
  return {
    // Border characters
    horizontal: capabilities.supportsUnicode ? '─' : '-',
    vertical: capabilities.supportsUnicode ? '│' : '|',
    topLeft: capabilities.supportsUnicode ? '┌' : '+',
    topRight: capabilities.supportsUnicode ? '┐' : '+',
    bottomLeft: capabilities.supportsUnicode ? '└' : '+',
    bottomRight: capabilities.supportsUnicode ? '┘' : '+',
    
    // Decorative characters
    bullet: capabilities.supportsUnicode ? '▶' : '>',
    arrow: capabilities.supportsUnicode ? '→' : '->',
    dot: capabilities.supportsUnicode ? '·' : '.',
    
    // Status indicators
    success: capabilities.supportsUnicode ? '✓' : '[OK]',
    error: capabilities.supportsUnicode ? '✗' : '[ERROR]',
    warning: capabilities.supportsUnicode ? '⚠' : '[WARN]',
    loading: capabilities.supportsUnicode ? '⏳' : '[LOADING]',
    sparkle: capabilities.supportsUnicode ? '✨' : '*'
  };
};

/**
 * Validate terminal dimensions and provide fallbacks
 */
export const validateTerminalDimensions = (
  width: number, 
  height: number, 
  capabilities: TerminalCapabilities
) => {
  const validatedWidth = Math.max(width || 80, capabilities.minWidth);
  const validatedHeight = Math.max(height || 24, capabilities.minHeight);
  
  const isTooSmall = width < capabilities.minWidth || height < capabilities.minHeight;
  
  return {
    width: validatedWidth,
    height: validatedHeight,
    isTooSmall,
    warnings: {
      width: width < capabilities.minWidth ? `Terminal width (${width}) is below minimum (${capabilities.minWidth})` : null,
      height: height < capabilities.minHeight ? `Terminal height (${height}) is below minimum (${capabilities.minHeight})` : null
    }
  };
};

/**
 * Safe color application that falls back to no color
 */
export const safeColor = (text: string, _color: string, capabilities: TerminalCapabilities): string => {
  if (!capabilities.supportsColor) {
    return text;
  }
  return text; // Let Ink handle the actual coloring
};