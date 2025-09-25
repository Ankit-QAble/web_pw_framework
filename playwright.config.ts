import { defineConfig, devices } from '@playwright/test';
import { envConfig } from './framework/utils/EnvConfig';

// Environment profiles inspired by user's desired schema
// Select via RUN (preferred) or NODE_ENV. Defaults to 'development'.
const PROFILES = {
  development: {
    baseURL: 'http://devwebpanel.sadadqa.com:3004/auth/business-details',
    browser: 'chromium', // 'chrome'|'chromium'|'firefox'|'webkit'
    headless: false,
    parallel: 1, // workers
    retries: 1,
    screenshotOnFail: true,
    videoOnFail: true,
  },
  preprod: {
    baseURL: 'https://aks-panel.sadad.qa/auth/login',
    browser: 'chrome',
    headless: false,
    parallel: 3,
    retries: 2,
    screenshotOnFail: true,
    videoOnFail: true,
    mobile: {
      mobile: { 
        isMobile: false, 
        device: 'pixel 9' },
    }
    
  },
} as const;

type ProfileName = keyof typeof PROFILES;
const selectedProfileName: ProfileName = (process.env.RUN as ProfileName) || (process.env.NODE_ENV as ProfileName) || 'development';
const selectedProfile = PROFILES[selectedProfileName] || PROFILES.development;
// Expose profile baseURL to rest of code via env for utilities
process.env.BASE_URL = selectedProfile.baseURL;

function mapBrowserToProject(browser: string) {
  const b = browser?.toLowerCase();
  if (b === 'chrome' || b === 'chromium') {
    return { name: 'chromium', use: { ...devices['Desktop Chrome'] } };
  }
  if (b === 'firefox') {
    return { name: 'firefox', use: { ...devices['Desktop Firefox'] } };
  }
  if (b === 'webkit' || b === 'safari') {
    return { name: 'webkit', use: { ...devices['Desktop Safari'] } };
  }
  return { name: 'chromium', use: { ...devices['Desktop Chrome'] } };
}

// Environment variables are loaded by EnvConfig

// Mobile device aliases to Playwright device descriptors
const MOBILE_DEVICE_ALIASES: Record<string, keyof typeof devices> = {
  'pixel 5': 'Pixel 5',
  'pixel5': 'Pixel 5',
  'pixel 7': 'Pixel 7',
  'pixel7': 'Pixel 7',
  // approximate mapping for convenience
  'pixel 9': 'Pixel 7',
  'samsung s9': 'Galaxy S9+',
  'galaxy s9+': 'Galaxy S9+',
  'iphone 12': 'iPhone 12',
  'iphone 14 pro': 'iPhone 14 Pro',
  'ipad mini': 'iPad Mini',
};

function resolveMobileUse(mobile: any) {
  // Support nested shape like { mobile: { isMobile: true, device: '...' } }
  const m = mobile?.mobile ?? mobile;
  const deviceName: string | undefined = m?.device;
  let baseDevice: any = devices['Pixel 5'];
  if (deviceName) {
    const alias = MOBILE_DEVICE_ALIASES[`${deviceName}`.toLowerCase()];
    const key = alias || (devices as any)[deviceName] ? deviceName : undefined;
    if (key && (devices as any)[key]) {
      baseDevice = (devices as any)[key];
    }
  }
  // Exclude control fields when spreading overrides
  const { isMobile: _ignoreIsMobile, device: _ignoreDevice, ...overrides } = m || {};
  return { 
    ...baseDevice,
    ...overrides,
    // enforce mobile characteristics
    isMobile: true,
    hasTouch: true,
  };
}

// Build projects conditionally: if mobile specified and isMobile==true, use that; else use desktop from profile
const computedProjects = ((selectedProfile as any).mobile?.mobile ?? (selectedProfile as any).mobile)?.isMobile
  ? [
      {
        name: 'mobile-profile',
        use: resolveMobileUse((selectedProfile as any).mobile),
      },
    ]
  : [mapBrowserToProject(selectedProfile.browser)];

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './test/specs',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : selectedProfile.retries,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : selectedProfile.parallel,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: false,
    }],
    ['list']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: selectedProfile.baseURL || envConfig.getBaseUrl(),

    /* Browser headless mode */
    headless: selectedProfile.headless,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: selectedProfile.screenshotOnFail ? 'only-on-failure' : 'off',
    
    /* Record video on failure */
    video: selectedProfile.videoOnFail ? 'retain-on-failure' : 'off',
    
    /* Global timeout for each action */
    actionTimeout: 30000,
    
    /* Global timeout for navigation */
    navigationTimeout: 30000,

    /* Optionally grant common permissions */
    //permissions: selectedProfile.autoGrantPermissions ? ['geolocation', 'notifications', 'camera', 'microphone'] : undefined,
  },

  /* Configure projects for major browsers */
  projects: computedProjects,

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});