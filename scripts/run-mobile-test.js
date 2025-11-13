#!/usr/bin/env node
/**
 * Script to run Playwright tests with mobile device configuration
 * Supports custom device names and viewport dimensions
 * 
 * Usage:
 *   node scripts/run-mobile-test.js [device] [--width=W] [--height=H] [--env=ENV] [test-file]
 * 
 * Examples:
 *   node scripts/run-mobile-test.js pixel7
 *   node scripts/run-mobile-test.js iphone12 --width=390 --height=844
 *   node scripts/run-mobile-test.js pixel9 --env=preprod test/specs/login.spec.ts
 */

const { execSync } = require('child_process');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    device: null,
    viewportWidth: null,
    viewportHeight: null,
    environment: 'development',
    testFile: null,
    grep: null,
    headed: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--width=')) {
      config.viewportWidth = arg.split('=')[1];
    } else if (arg.startsWith('--height=')) {
      config.viewportHeight = arg.split('=')[1];
    } else if (arg.startsWith('--w=')) {
      config.viewportWidth = arg.split('=')[1];
    } else if (arg.startsWith('--h=')) {
      config.viewportHeight = arg.split('=')[1];
    } else if (arg.startsWith('--env=')) {
      config.environment = arg.split('=')[1];
    } else if (arg.startsWith('--grep=') || arg.startsWith('-g=')) {
      config.grep = arg.split('=')[1];
    } else if (arg === '--grep' || arg === '-g') {
      config.grep = args[++i];
    } else if (arg === '--headed' || arg === '-h') {
      config.headed = true;
    } else if (arg.endsWith('.spec.ts') || arg.endsWith('.spec.js')) {
      config.testFile = arg;
    } else if (!arg.startsWith('--') && !config.device) {
      config.device = arg;
    }
  }

  return config;
}

function buildCommand(config) {
  const projectRoot = path.resolve(__dirname, '..');
  process.chdir(projectRoot);

  let command = 'npx playwright test';
  
  // Add test file if specified
  if (config.testFile) {
    command += ` ${config.testFile}`;
  }
  
  // Add grep filter if specified
  if (config.grep) {
    command += ` --grep "${config.grep}"`;
  }
  
  // Add headed mode if specified
  if (config.headed) {
    command += ' --headed';
  }

  // Build environment variables
  const envVars = {
    RUN: config.environment,
    MOBILE_DEVICE: config.device,
  };

  if (config.viewportWidth) {
    envVars.VIEWPORT_WIDTH = config.viewportWidth;
  }

  if (config.viewportHeight) {
    envVars.VIEWPORT_HEIGHT = config.viewportHeight;
  }

  console.log('📱 Mobile Test Configuration:');
  console.log(`   Device: ${config.device || 'Not specified (using config default)'}`);
  if (config.viewportWidth) console.log(`   Viewport Width: ${config.viewportWidth}px`);
  if (config.viewportHeight) console.log(`   Viewport Height: ${config.viewportHeight}px`);
  console.log(`   Environment: ${config.environment}`);
  if (config.testFile) console.log(`   Test File: ${config.testFile}`);
  if (config.grep) console.log(`   Filter: ${config.grep}`);
  console.log(`\n🚀 Running: ${command}\n`);

  // Execute command with environment variables
  execSync(command, {
    stdio: 'inherit',
    env: { ...process.env, ...envVars }
  });
}

// Main execution
const config = parseArgs();

if (!config.device) {
  console.error('❌ Error: Device name is required');
  console.log('\nUsage:');
  console.log('  node scripts/run-mobile-test.js <device> [options]');
  console.log('\nExamples:');
  console.log('  node scripts/run-mobile-test.js pixel7');
  console.log('  node scripts/run-mobile-test.js iphone12 --width=390 --height=844');
  console.log('  node scripts/run-mobile-test.js pixel9 --env=preprod --grep=@smoke');
  console.log('  node scripts/run-mobile-test.js pixel7 test/specs/login.spec.ts');
  console.log('\nAvailable devices:');
  console.log('  - pixel5, pixel7, pixel9');
  console.log('  - iphone11, iphone12, iphone14, iphone14pro');
  console.log('  - galaxy s9, ipad mini, ipad pro');
  console.log('\nOptions:');
  console.log('  --width=WIDTH or --w=WIDTH   : Set viewport width (e.g., 375)');
  console.log('  --height=HEIGHT or --h=HEIGHT : Set viewport height (e.g., 667)');
  console.log('  --env=ENV                    : Set environment (development, preprod, qable)');
  console.log('  --grep=PATTERN or -g=PATTERN  : Filter tests by tag/pattern');
  console.log('  --headed or -h                : Run in headed mode');
  process.exit(1);
}

buildCommand(config);
