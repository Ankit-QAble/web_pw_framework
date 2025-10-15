#!/usr/bin/env node

/**
 * Azure Playwright Testing Token Helper
 * 
 * This script helps you get a fresh access token for Azure Playwright Testing.
 * 
 * Prerequisites:
 * 1. Azure CLI installed and logged in: az login
 * 2. Azure Playwright Testing workspace created
 * 
 * Usage:
 *   node scripts/get-azure-token.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔑 Azure Playwright Testing Token Helper\n');

// Check if Azure CLI is available
try {
  console.log('📋 Checking Azure CLI...');
  execSync('az --version', { stdio: 'pipe' });
  console.log('✅ Azure CLI is available\n');
} catch (error) {
  console.log('❌ Azure CLI not found. Please install it first:');
  console.log('   winget install Microsoft.AzureCLI');
  console.log('   or download from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli\n');
  process.exit(1);
}

// Check if user is logged in
try {
  console.log('🔐 Checking Azure authentication...');
  const accountInfo = execSync('az account show --output json', { encoding: 'utf8' });
  const account = JSON.parse(accountInfo);
  console.log(`✅ Logged in as: ${account.user.name}`);
  console.log(`   Subscription: ${account.name} (${account.id})\n`);
} catch (error) {
  console.log('❌ Not logged in to Azure. Please run: az login\n');
  process.exit(1);
}

// Get Azure Playwright Testing workspaces
try {
  console.log('🔍 Finding Azure Playwright Testing workspaces...');
  const workspaces = execSync('az resource list --resource-type "Microsoft.PlaywrightTesting/workspaces" --output json', { encoding: 'utf8' });
  const workspaceList = JSON.parse(workspaces);
  
  if (workspaceList.length === 0) {
    console.log('❌ No Azure Playwright Testing workspaces found.');
    console.log('   Please create one at: https://portal.azure.com/\n');
    process.exit(1);
  }
  
  console.log(`✅ Found ${workspaceList.length} workspace(s):`);
  workspaceList.forEach((ws, index) => {
    console.log(`   ${index + 1}. ${ws.name} (${ws.location})`);
  });
  
  // Use the first workspace
  const workspace = workspaceList[0];
  console.log(`\n🎯 Using workspace: ${workspace.name}\n`);
  
  // Generate access token
  console.log('🔑 Generating access token...');
  const tokenCommand = `az account get-access-token --resource "https://playwright.microsoft.com" --output json`;
  const tokenInfo = execSync(tokenCommand, { encoding: 'utf8' });
  const token = JSON.parse(tokenInfo);
  
  console.log('✅ Access token generated successfully!\n');
  
  // Update .env file
  const envPath = path.join(__dirname, '..', '.env');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Update or add PLAYWRIGHT_SERVICE_URL
  const serviceUrl = `https://${workspace.location}.api.playwright.microsoft.com/playwrightworkspaces/${workspace.name}`;
  if (envContent.includes('PLAYWRIGHT_SERVICE_URL=')) {
    envContent = envContent.replace(
      /PLAYWRIGHT_SERVICE_URL=.*/,
      `PLAYWRIGHT_SERVICE_URL=${serviceUrl}`
    );
  } else {
    envContent += `\nPLAYWRIGHT_SERVICE_URL=${serviceUrl}\n`;
  }
  
  // Update or add PLAYWRIGHT_SERVICE_ACCESS_TOKEN
  if (envContent.includes('PLAYWRIGHT_SERVICE_ACCESS_TOKEN=')) {
    envContent = envContent.replace(
      /PLAYWRIGHT_SERVICE_ACCESS_TOKEN=.*/,
      `PLAYWRIGHT_SERVICE_ACCESS_TOKEN=${token.accessToken}`
    );
  } else {
    envContent += `PLAYWRIGHT_SERVICE_ACCESS_TOKEN=${token.accessToken}\n`;
  }
  
  fs.writeFileSync(envPath, envContent);
  
  console.log('📝 Updated .env file with:');
  console.log(`   PLAYWRIGHT_SERVICE_URL=${serviceUrl}`);
  console.log(`   PLAYWRIGHT_SERVICE_ACCESS_TOKEN=${token.accessToken.substring(0, 20)}...`);
  console.log(`\n⏰ Token expires: ${new Date(token.expiresOn).toLocaleString()}`);
  console.log('\n🚀 You can now run Azure tests with:');
  console.log('   npm run test:azure:service');
  console.log('   npm run test:azure:smoke');
  
} catch (error) {
  console.log('❌ Error getting workspace information:');
  console.log(`   ${error.message}\n`);
  console.log('💡 Make sure you have:');
  console.log('   1. Created an Azure Playwright Testing workspace');
  console.log('   2. Have the correct permissions');
  console.log('   3. Are logged in with: az login\n');
  process.exit(1);
}
