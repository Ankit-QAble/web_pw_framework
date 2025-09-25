/**
 * Environment Switching Utility
 * 
 * Usage: node scripts/switch-env.js [environment]
 * Where environment is one of: development, preprod, production
 */

const fs = require('fs');
const path = require('path');

// Get environment from command line argument
const targetEnv = process.argv[2] || 'development';
const validEnvs = ['development', 'preprod', 'production'];

if (!validEnvs.includes(targetEnv)) {
  console.error(`Error: Invalid environment "${targetEnv}". Valid options are: ${validEnvs.join(', ')}`);
  process.exit(1);
}

// Set NODE_ENV for the current process
process.env.NODE_ENV = targetEnv;

console.log(`Switching to ${targetEnv} environment...`);

// Update package.json scripts to include environment setting
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = require(packageJsonPath);

// Add environment-specific test commands if they don't exist
if (!packageJson.scripts[`test:${targetEnv}`]) {
  packageJson.scripts[`test:${targetEnv}`] = `cross-env NODE_ENV=${targetEnv} npx playwright test`;
  
  // Write updated package.json
  fs.writeFileSync(
    packageJsonPath, 
    JSON.stringify(packageJson, null, 2) + '\n', 
    'utf8'
  );
  
  console.log(`Added "test:${targetEnv}" script to package.json`);
}

console.log(`Environment switched to ${targetEnv}`);
console.log(`Run tests with: npm run test:${targetEnv}`);