#!/usr/bin/env node
/**
 * Watch Script
 * Monitors file changes and rebuilds on save
 */

import fs from 'fs';
import { execSync } from 'child_process';

const watchDirs = ['assets/js', 'assets/css'];
const debounceTime = 500;
let buildTimeout;

console.log('👀 Watching for changes...');
console.log('Files: assets/js/*.js, assets/css/*.css');
console.log('Press Ctrl+C to stop\n');

function debouncedBuild() {
  clearTimeout(buildTimeout);
  buildTimeout = setTimeout(() => {
    try {
      console.log('🔄 Rebuilding...');
      execSync('npm run build', { stdio: 'inherit' });
      console.log('✅ Rebuild complete\n');
    } catch (error) {
      console.error('❌ Build failed:', error.message);
    }
  }, debounceTime);
}

watchDirs.forEach(dir => {
  fs.watch(dir, { recursive: true }, (eventType, filename) => {
    if (filename && (filename.endsWith('.js') || filename.endsWith('.css'))) {
      console.log(`📝 ${eventType}: ${filename}`);
      debouncedBuild();
    }
  });
});
