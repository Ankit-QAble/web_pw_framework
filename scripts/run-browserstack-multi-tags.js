#!/usr/bin/env node

/**
 * Run BrowserStack tests with multiple tags
 * This script properly handles tag patterns that don't work directly on Windows
 * 
 * Usage:
 *   node scripts/run-browserstack-multi-tags.js "@critical|@smoke"
 *   npm run test:browserstack:tags
 */

const { spawn } = require('child_process');

// Get tags from command line argument or use default
const tags = process.argv[2] || '@critical|@smoke';

console.log(`🚀 Running BrowserStack tests with pattern: ${tags}\n`);

// Run the command with proper argument passing
const command = 'npx';
const args = ['browserstack-node-sdk', 'playwright', 'test', `--grep=${tags}`];

const child = spawn(command, args, {
  stdio: 'inherit',
  shell: true,
  env: process.env
});

child.on('error', (error) => {
  console.error(`❌ Error: ${error.message}`);
  process.exit(1);
});

child.on('close', (code) => {
  if (code !== 0) {
    console.error(`\n❌ Process exited with code ${code}`);
    process.exit(code);
  }
  console.log('\n✅ Tests completed successfully!');
  process.exit(0);
});

