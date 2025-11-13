#!/usr/bin/env node
/**
 * Script to run Playwright tests that can be called via MCP
 * This script allows MCP servers to trigger test execution
 */

const { execSync } = require('child_process');
const path = require('path');

// Get test file path and options from command line
const args = process.argv.slice(2);
const testFile = args.find(arg => arg.endsWith('.spec.ts') || arg.endsWith('.spec.js'));
const testFilter = args.find(arg => arg.startsWith('--grep') || arg.startsWith('-g'));
const env = args.find(arg => arg.startsWith('RUN=')) || 'RUN=development';
const config = args.find(arg => arg.startsWith('--config=')) || '';

function runTest() {
  try {
    const projectRoot = path.resolve(__dirname, '..');
    process.chdir(projectRoot);

    // Build command
    let command = 'npx playwright test';
    
    // Add config if specified
    if (config) {
      command += ` ${config}`;
    }
    
    // Add test file if specified
    if (testFile) {
      command += ` ${testFile}`;
    }
    
    // Add filter if specified
    if (testFilter) {
      command += ` ${testFilter}`;
    }
    
    // Set environment
    const [envKey, envValue] = env.split('=');
    process.env[envKey] = envValue;
    
    console.log(`🚀 Running test command: ${command}`);
    console.log(`📁 Working directory: ${projectRoot}`);
    console.log(`🌍 Environment: ${env}\n`);
    
    execSync(command, {
      stdio: 'inherit',
      env: { ...process.env, [envKey]: envValue }
    });
    
    console.log('\n✅ Test execution completed successfully');
  } catch (error) {
    console.error('\n❌ Test execution failed:', error.message);
    process.exit(1);
  }
}

// Available test commands for MCP
const availableCommands = {
  'run:smoke': () => runTestWithFilter('@smoke'),
  'run:critical': () => runTestWithFilter('@critical'),
  'run:login': () => runTestWithFile('test/specs/login.spec.ts'),
  'run:all': () => runTest(),
};

function runTestWithFilter(filter) {
  process.argv.push('--grep', filter);
  runTest();
}

function runTestWithFile(file) {
  process.argv.push(file);
  runTest();
}

// Main execution
if (process.argv.length === 3 && availableCommands[process.argv[2]]) {
  availableCommands[process.argv[2]]();
} else {
  runTest();
}
