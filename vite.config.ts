import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'node18',
    lib: {
      entry: 'src/index.tsx',
      name: 'terminal-portfolio',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: [
        'react', 
        'react-dom', 
        'ink', 
        'chalk', 
        'boxen',
        // Node.js built-ins
        'fs',
        'path',
        'process',
        'util',
        'events',
        'stream',
        'tty',
        'os'
      ],
      output: {
        banner: '#!/usr/bin/env node',
        format: 'es',
        entryFileNames: 'index.js'
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'esbuild',
    sourcemap: false
  },
  esbuild: {
    jsx: 'automatic',
    platform: 'node',
    target: 'node18'
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
})