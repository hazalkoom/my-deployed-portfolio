#!/usr/bin/env node
/**
 * JavaScript Build Script
 * Minifies JS files using esbuild
 */

import esbuild from 'esbuild';
import * as fs from 'fs';

const jsFiles = [
  { in: 'assets/js/core.js', out: 'assets/js/dist/core.min.js' },
  { in: 'assets/js/animations.js', out: 'assets/js/dist/animations.min.js' },
  { in: 'assets/js/contact-form.js', out: 'assets/js/dist/contact-form.min.js' }
];

// Create dist directory if it doesn't exist
if (!fs.existsSync('assets/js/dist')) {
  fs.mkdirSync('assets/js/dist', { recursive: true });
}

async function buildJS() {
  try {
    console.log('📦 Building JavaScript...');

    for (const file of jsFiles) {
      const result = await esbuild.build({
        entryPoints: [file.in],
        outfile: file.out,
        minify: true,
        bundle: false,
        sourcemap: false,
        logLevel: 'silent'
      });

      const originalSize = fs.statSync(file.in).size;
      const minifiedSize = fs.statSync(file.out).size;
      const reduction = ((1 - minifiedSize / originalSize) * 100).toFixed(2);

      console.log(`✓ ${file.out} (${(originalSize / 1024).toFixed(2)}KB → ${(minifiedSize / 1024).toFixed(2)}KB, ${reduction}% reduction)`);
    }

    console.log('\n✅ JavaScript build complete');

  } catch (error) {
    console.error('❌ JavaScript build failed:', error.message);
    process.exit(1);
  }
}

buildJS();
