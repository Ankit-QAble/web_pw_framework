import { defineConfig, devices } from '@playwright/test';
import { createAzurePlaywrightConfig, ServiceOS, ServiceAuth } from '@azure/playwright';
import config from './playwright.config';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Azure Playwright Testing Configuration
 * 
 * Prerequisites:
 * 1. Create Azure Playwright Testing workspace at https://portal.azure.com/
 * 2. Set environment variables:
 *    - PLAYWRIGHT_SERVICE_URL=https://<region>.api.playwright.microsoft.com
 * 3. Authenticate using Azure CLI: az login
 * 
 * Usage:
 *   npm run test:azure
 *   npm run test:azure:smoke
 *   npx playwright test -c playwright.azure.config.ts
 * 
 * Note: Azure Playwright Testing uses the standard Playwright configuration
 *       with cloud-hosted browsers accessed via the service URL.
 */

// Get Azure configuration from environment
const azureServiceUrl = process.env.PLAYWRIGHT_SERVICE_URL;
const azureAccessToken = process.env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN;

if (!azureServiceUrl) {
  console.warn('⚠️  PLAYWRIGHT_SERVICE_URL not set. Tests will run locally.');
  console.warn('   Set it to use Azure cloud browsers: export PLAYWRIGHT_SERVICE_URL=https://<region>.api.playwright.microsoft.com');
}

// Base configuration
const baseConfig = defineConfig({
  ...config,
  
  // Azure-specific settings
  workers: process.env.CI ? 20 : 10, // High parallelization for Azure
  timeout: 60000,
  
  // Reporter configuration for Azure
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { 
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: true
    }],
  ],

  use: {
    ...config.use,
    
    // Trace and video for debugging
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    
    // Extended timeouts for cloud testing
    actionTimeout: 30000,
    navigationTimeout: 60000,
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // {
    //   name: 'mobile-chrome',
    //   use: { 
    //     ...devices['Pixel 5'],
    //   },
    // },
    // {
    //   name: 'mobile-safari',
    //   use: { 
    //     ...devices['iPhone 13'],
    //   },
    // },
    // {
    //   name: 'edge',
    //   use: { 
    //     ...devices['Desktop Edge'],
    //     channel: 'msedge',
    //   },
    // },
  ],
});

// Export Azure configuration with cloud connection if service URL is set
export default azureServiceUrl && azureAccessToken
  ? defineConfig(
      baseConfig,
      createAzurePlaywrightConfig(baseConfig, {
        serviceAuthType: ServiceAuth.ACCESS_TOKEN,
        exposeNetwork: '<loopback>',
        connectTimeout: 3 * 60 * 1000, // 3 minutes
        os: ServiceOS.LINUX,
      })
    )
  : baseConfig;

