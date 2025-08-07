import { render } from 'ink';
import performanceMonitor from './utils/performanceMonitor';

// Lazy load heavy components to improve startup time
const loadApp = async () => {
  performanceMonitor.start('App component load');
  const { default: App } = await import('./components/App');
  performanceMonitor.end('App component load');
  return App;
};

const loadSessionManager = async () => {
  performanceMonitor.start('Session manager load');
  const { initializeSessionManager } = await import('./utils/sessionManager');
  performanceMonitor.end('Session manager load');
  return initializeSessionManager;
};

// Parse command line arguments
const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    help: false,
    version: false,
  };

  for (const arg of args) {
    switch (arg) {
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--version':
      case '-v':
        options.version = true;
        break;
      default:
        // Ignore unknown arguments for now
        break;
    }
  }

  return options;
};

// Display help information
const showHelp = () => {
  console.log(`
Terminal Portfolio - Interactive portfolio in your terminal

Usage: terminal-portfolio [options]

Options:
  -h, --help     Show this help message
  -v, --version  Show version information

This application displays an interactive portfolio interface in the terminal.
Use arrow keys or vim-style navigation (hjkl) to navigate between sections.
Press 'q' or Ctrl+C to exit.
`);
};

// Display version information
const showVersion = () => {
  // Version will be injected during build
  const version = '1.0.0';
  console.log(`terminal-portfolio v${version}`);
};

// Initialize and render the application
const main = async () => {
  performanceMonitor.start('Application startup');
  
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  if (options.version) {
    showVersion();
    process.exit(0);
  }

  try {
    // Load session manager asynchronously
    const initializeSessionManager = await loadSessionManager();
    
    // Initialize session manager
    const sessionManager = initializeSessionManager({
      enableLogging: true,
      logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
      maxSessions: 50,
      sessionTimeout: 30 * 60 * 1000 // 30 minutes
    });

    // Set up graceful shutdown
    const cleanup = async () => {
      try {
        await sessionManager.shutdown();
        if (performanceMonitor.isEnabled()) {
          performanceMonitor.logSummary();
        }
      } catch (error) {
        console.error('Error during session cleanup:', error);
      }
      process.exit(0);
    };

    // Handle various shutdown signals
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('SIGHUP', cleanup);

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught exception:', error);
      cleanup();
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled rejection at:', promise, 'reason:', reason);
      cleanup();
    });

    // Load and render the React Ink application
    performanceMonitor.start('App render');
    const App = await loadApp();
    const { unmount } = render(<App />);
    performanceMonitor.end('App render');
    
    performanceMonitor.end('Application startup');

    // Handle cleanup on exit
    process.on('exit', () => {
      unmount();
    });

    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        performanceMonitor.logSummary();
      }, 1000);
    }
    
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
};

// Handle CLI execution
// Check if this file is being run directly
const isMainModule = () => {
  try {
    return import.meta.url === `file://${process.argv[1]}` || 
           process.argv[1]?.endsWith('terminal-portfolio') ||
           process.argv[1]?.endsWith('index.js');
  } catch {
    return true; // Default to running if we can't determine
  }
};

if (isMainModule()) {
  main().catch((error) => {
    console.error('Failed to start terminal portfolio:', error);
    process.exit(1);
  });
}

export default main;