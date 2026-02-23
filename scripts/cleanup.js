#!/usr/bin/env node
/**
 * Cleanup Script
 * Removes old dist files and generates build summary
 */

import * as fs from 'fs';
import * as path from 'path';

function getDirectorySize(dirPath) {
  let size = 0;
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      size += getDirectorySize(filePath);
    } else {
      size += stat.size;
    }
  });

  return size;
}

try {
  console.log('\n🧹 Build Summary:');

  const assetsSize = getDirectorySize('assets');
  const cssSize = getDirectorySize('assets/css');
  const jsSize = getDirectorySize('assets/js');
  const imgSize = getDirectorySize('assets/img');

  console.log(`📊 Asset Sizes:`);
  console.log(`   Total assets: ${(assetsSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`   CSS: ${(cssSize / 1024).toFixed(2)}KB`);
  console.log(`   JS: ${(jsSize / 1024).toFixed(2)}KB`);
  console.log(`   Images: ${(imgSize / 1024 / 1024).toFixed(2)}MB`);

  console.log(`\n✅ Build complete! Ready for deployment.`);

} catch (error) {
  console.error('❌ Cleanup failed:', error.message);
  process.exit(1);
}
