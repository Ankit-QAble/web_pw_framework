import { defineConfig, devices } from '@playwright/test';
import config from './playwright.config';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Microsoft Azure Playwright Testing Service Configuration
 * 
 * Prerequisites:
 * 1. Set PLAYWRIGHT_SERVICE_URL in .env file
 * 2. Set PLAYWRIGHT_SERVICE_ACCESS_TOKEN in .env file
 * 3. Ensure Azure Playwright Testing workspace is created
 * 
 * Usage:
 *   npx playwright test --config=playwright.service.config.ts --workers=20
 */

export default defineConfig(config, {
  // Azure Playwright Testing - High parallelization
  workers: process.env.CI ? 50 : 20,
  
  // Longer timeout for cloud execution
  timeout: 60000,
  
  // Retry on first failure
  retries: process.env.CI ? 2 : 1,
  
  use: {
    // Connect to Azure Playwright Testing service with authentication
    connectOptions: {
      wsEndpoint: `${process.env.PLAYWRIGHT_SERVICE_URL}?os=linux&runId=${Date.now()}-${process.env.USER || process.env.USERNAME || 'user'}`,
      headers: {
        'Authorization': `Bearer ${process.env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN}`,
        'x-mpt-access-key': process.env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN,
      },
      timeout: 30000,
    },
    
    // Extended timeouts for cloud
    actionTimeout: 30000,
    navigationTimeout: 60000,
    
    // Capture on failure
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  // Reporters optimized for Azure
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'results.json' }],
    ['junit', { outputFile: 'junit.xml' }],
    ['allure-playwright', { 
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: true
    }],
    ['github'], // For GitHub Actions
  ],

  // Browser projects for Azure
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
});

