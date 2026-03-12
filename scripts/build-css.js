#!/usr/bin/env node
/**
 * CSS Build Script
 * Minifies CSS files using csso-cli
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const cssDir = 'assets/css';
const distDir = 'assets/css/dist';

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

try {
  console.log('🎨 Building CSS...');

  // Minify main.css
  execSync(`npx csso assets/css/main.css -o ${distDir}/main.min.css`, { stdio: 'inherit' });
  console.log('✓ main.min.css created');

  // Get file sizes for comparison
  const mainOriginal = fs.statSync('assets/css/main.css').size;
  const mainMinified = fs.statSync(`${distDir}/main.min.css`).size;
  const reduction = ((1 - mainMinified / mainOriginal) * 100).toFixed(2);

  console.log(`\n📊 CSS Stats:`);
  console.log(`   main.css: ${(mainOriginal / 1024).toFixed(2)}KB → ${(mainMinified / 1024).toFixed(2)}KB (${reduction}% reduction)`);

} catch (error) {
  console.error('❌ CSS build failed:', error.message);
  process.exit(1);
}
