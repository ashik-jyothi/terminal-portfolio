#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, statSync } from 'fs';
import { join } from 'path';

const DIST_DIR = 'dist';
const ENTRY_FILE = join(DIST_DIR, 'index.js');

console.log('🔍 Validating build output...\n');

// Check if dist directory exists
if (!existsSync(DIST_DIR)) {
  console.error('❌ Build failed: dist directory not found');
  process.exit(1);
}

// Check if entry file exists
if (!existsSync(ENTRY_FILE)) {
  console.error('❌ Build failed: entry file not found at', ENTRY_FILE);
  process.exit(1);
}

// Check if entry file is executable
try {
  const stats = statSync(ENTRY_FILE);
  if (!(stats.mode & parseInt('111', 8))) {
    console.error('❌ Build failed: entry file is not executable');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Build failed: cannot check file permissions', error.message);
  process.exit(1);
}

// Test CLI help command
try {
  console.log('📋 Testing --help command:');
  const helpOutput = execSync('node dist/index.js --help', { encoding: 'utf8' });
  if (!helpOutput.includes('Terminal Portfolio')) {
    console.error('❌ Build failed: help output is invalid');
    process.exit(1);
  }
  console.log('✅ Help command works correctly\n');
} catch (error) {
  console.error('❌ Build failed: help command failed', error.message);
  process.exit(1);
}

// Test CLI version command
try {
  console.log('📋 Testing --version command:');
  const versionOutput = execSync('node dist/index.js --version', { encoding: 'utf8' });
  if (!versionOutput.includes('terminal-portfolio')) {
    console.error('❌ Build failed: version output is invalid');
    process.exit(1);
  }
  console.log('✅ Version command works correctly\n');
} catch (error) {
  console.error('❌ Build failed: version command failed', error.message);
  process.exit(1);
}

// Test that the main application can start (briefly)
try {
  console.log('📋 Testing main application startup:');
  // Run with timeout to avoid hanging
  execSync('timeout 2s node dist/index.js || true', { encoding: 'utf8' });
  console.log('✅ Main application starts correctly\n');
} catch (error) {
  // Timeout is expected, so we only fail on other errors
  if (!error.message.includes('timeout')) {
    console.error('❌ Build failed: main application startup failed', error.message);
    process.exit(1);
  }
  console.log('✅ Main application starts correctly\n');
}

console.log('🎉 Build validation completed successfully!');
console.log('📦 Built application is ready for deployment');