#!/usr/bin/env node

/**
 * Jenkins Environment Diagnostic Script
 * Run this script in Jenkins to diagnose common issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Jenkins Environment Diagnostic Tool');
console.log('=====================================\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log('CI:', process.env.CI || 'Not set');
console.log('JENKINS:', process.env.JENKINS || 'Not set');
console.log('BUILD_NUMBER:', process.env.BUILD_NUMBER || 'Not set');
console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');
console.log('USER:', process.env.USER || 'Not set');
console.log('HOME:', process.env.HOME || 'Not set');
console.log('PWD:', process.env.PWD || 'Not set');
console.log('');

// Check system resources
console.log('💻 System Resources:');
try {
  const memInfo = execSync('free -h', { encoding: 'utf8' });
  console.log('Memory:', memInfo);
} catch (e) {
  console.log('Memory check failed:', e.message);
}

try {
  const diskInfo = execSync('df -h', { encoding: 'utf8' });
  console.log('Disk space:', diskInfo);
} catch (e) {
  console.log('Disk check failed:', e.message);
}

// Check Node.js and npm
console.log('📦 Node.js Environment:');
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' });
  console.log('Node.js version:', nodeVersion.trim());
} catch (e) {
  console.log('Node.js not found:', e.message);
}

try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' });
  console.log('npm version:', npmVersion.trim());
} catch (e) {
  console.log('npm not found:', e.message);
}

// Check Playwright installation
console.log('🎭 Playwright Environment:');
try {
  const playwrightVersion = execSync('npx playwright --version', { encoding: 'utf8' });
  console.log('Playwright version:', playwrightVersion.trim());
} catch (e) {
  console.log('Playwright not found:', e.message);
}

// Check browser installations
console.log('🌐 Browser Installations:');
const browsers = ['chromium', 'firefox', 'webkit'];
browsers.forEach(browser => {
  try {
    const browserPath = execSync(`npx playwright install --dry-run ${browser}`, { encoding: 'utf8' });
    console.log(`${browser}:`, browserPath.includes('already installed') ? '✅ Installed' : '❌ Not installed');
  } catch (e) {
    console.log(`${browser}: ❌ Error checking installation`);
  }
});

// Check project files
console.log('📁 Project Structure:');
const requiredFiles = [
  'package.json',
  'playwright.config.ts',
  'test/specs/login.spec.ts',
  'framework/core/BasePage.ts'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - exists`);
  } else {
    console.log(`❌ ${file} - missing`);
  }
});

// Check Playwright cache directory
console.log('💾 Playwright Cache:');
const cachePaths = [
  '/var/lib/jenkins/.cache/ms-playwright',
  path.join(process.env.HOME || '', '.cache/ms-playwright'),
  path.join(process.cwd(), 'node_modules/@playwright/browsers')
];

cachePaths.forEach(cachePath => {
  if (fs.existsSync(cachePath)) {
    try {
      const stats = fs.statSync(cachePath);
      console.log(`✅ Cache found at: ${cachePath} (${stats.isDirectory() ? 'directory' : 'file'})`);
    } catch (e) {
      console.log(`❌ Cache path exists but not accessible: ${cachePath}`);
    }
  } else {
    console.log(`❌ Cache not found at: ${cachePath}`);
  }
});

// Check permissions
console.log('🔐 Permissions:');
try {
  const permissions = execSync('ls -la /var/lib/jenkins/.cache/', { encoding: 'utf8' });
  console.log('Jenkins cache permissions:', permissions);
} catch (e) {
  console.log('Cannot check Jenkins cache permissions:', e.message);
}

console.log('\n🏁 Diagnostic complete!');
console.log('If you see any ❌ marks, those are potential issues to address.');
