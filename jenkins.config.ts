/**
 * Jenkins-specific Playwright configuration
 * This file contains optimizations specifically for Jenkins CI/CD environments
 */

import { defineConfig, devices } from '@playwright/test';

export const jenkinsConfig = {
  // Jenkins-optimized browser launch options
  browserLaunchOptions: {
    chromium: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--memory-pressure-off',
        '--max_old_space_size=4096',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-images',
        '--disable-javascript-harmony-shipping',
        '--disable-background-networking',
        '--disable-sync',
        '--metrics-recording-only',
        '--no-report-upload'
      ]
    },
    firefox: {
      args: [
        '-headless',
        '--no-sandbox',
        '--disable-dev-shm-usage'
      ]
    },
    webkit: {
      args: [
        '--no-sandbox'
      ]
    }
  },

  // Jenkins-optimized test settings
  testSettings: {
    timeout: 120000, // 2 minutes
    actionTimeout: 120000,
    navigationTimeout: 120000,
    workers: 2, // Limited to 2 workers for stability
    retries: 0, // More retries for flaky CI environment
    headless: true, // Always headless in Jenkins
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  // Jenkins environment variables
  environmentVariables: {
    CI: 'true',
    JENKINS: 'true',
    PLAYWRIGHT_BROWSERS_PATH: '/var/lib/jenkins/.cache/ms-playwright',
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: '0'
  }
};

/**
 * Helper function to check if running in Jenkins
 */
export function isJenkinsEnvironment(): boolean {
  return !!(process.env.CI || process.env.JENKINS || process.env.BUILD_NUMBER);
}

/**
 * Helper function to get Jenkins-optimized launch options for a specific browser
 */
export function getJenkinsLaunchOptions(browser: 'chromium' | 'firefox' | 'webkit') {
  if (!isJenkinsEnvironment()) {
    return {};
  }
  
  return jenkinsConfig.browserLaunchOptions[browser];
}

/**
 * Helper function to get Jenkins-optimized test settings
 */
export function getJenkinsTestSettings() {
  if (!isJenkinsEnvironment()) {
    return {};
  }
  
  return jenkinsConfig.testSettings;
}
