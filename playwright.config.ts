import { defineConfig, devices } from '@playwright/test';
import { envConfig } from './framework/utils/EnvConfig';

// Environment profiles inspired by user's desired schema
// Select via RUN (preferred) or NODE_ENV. Defaults to 'development'.
const PROFILES = {
  development: {
    baseURL: 'http://devwebpanel.sadadqa.com:3004',
    browser: 'chrome', // 'chrome'|'chromium'|'firefox'|'webkit'
    headless: true,
    parallel: 2, // workers
    retries: 0,
    screenshotOnFail: true,
    videoOnFail: true,
    elementHighlight: false,
    reportEmail: {
      email: false, // Set to true to enable email reporting and setup in utils/EmailService.ts
      to: ['patelankitr123@gmail.com'],
      subject: 'Automation Test Report',
      body: 'Test execution completed for development environment',
    },
    reportSmtp: envConfig.getSmtpConfig(),
  },
  preprod: {
    baseURL: 'https://aks-panel.sadad.qa/auth/login',
    browser: 'chrome', // 'chrome'|'chromium'|'firefox'|'webkit'|'chrome incognito'
    headless: false,
    parallel: 1,
    retries: 0,
    screenshotOnFail: true,
    videoOnFail: true,
    elementHighlight: true,
    mobile: {
      mobile: { 
        isMobile: false, 
        device: 'pixel 9' },
    },
    report: {
      name: 'allure-playwright',
      outputFolder: 'allure-results',
      suiteTitle: false,
    },
    reportEmail: {
      email: true,
      to: ['ankit.patel@sadad.qa'],
      subject: 'Preprod Test Report - Allure Results',
      body: 'Test execution completed for preprod environment. Allure report attached.',
    },
    reportSmtp: envConfig.getSmtpConfig(),

    
  },
} as const;

type ProfileName = keyof typeof PROFILES;
const selectedProfileName: ProfileName = (process.env.RUN as ProfileName) || (process.env.NODE_ENV as ProfileName) || 'development';
const selectedProfile = PROFILES[selectedProfileName] || PROFILES.development;
// Expose profile baseURL to rest of code via env for utilities
process.env.BASE_URL = selectedProfile.baseURL;

// Add selectedProfile to config for global setup/teardown
(global as any).selectedProfile = selectedProfile;

function mapBrowserToProject(browser: string) {
  const b = browser?.toLowerCase();
  
  // CI-optimized browser launch options
  const ciLaunchOptions = {
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
      '--disable-features=VizDisplayCompositor'
    ]
  };
  
  // Handle Chrome Incognito mode
  if (b === 'chrome incognito') {
    return { 
      name: 'chromium-incognito', 
      use: { 
        ...devices['Desktop Chrome'],
        // Add incognito context options
        launchOptions: {
          args: ['--incognito', ...ciLaunchOptions.args]
        }
      } 
    };
  }
  
  // Handle regular Chrome/Chromium
  if (b === 'chrome' || b === 'chromium') {
    return { 
      name: 'chromium', 
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: process.env.CI ? ciLaunchOptions : {}
      } 
    };
  }
  
  // Handle Firefox
  if (b === 'firefox') {
    return { 
      name: 'firefox', 
      use: { 
        ...devices['Desktop Firefox'],
        launchOptions: process.env.CI ? {
          args: ['-headless']
        } : {}
      } 
    };
  }
  
  // Handle WebKit/Safari
  if (b === 'webkit' || b === 'safari') {
    return { 
      name: 'webkit', 
      use: { 
        ...devices['Desktop Safari'],
        launchOptions: process.env.CI ? {
          args: ['--no-sandbox']
        } : {}
      } 
    };
  }
  
  // Default fallback
  return { 
    name: 'chromium', 
    use: { 
      ...devices['Desktop Chrome'],
      launchOptions: process.env.CI ? ciLaunchOptions : {}
    } 
  };
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
  /* Global timeout for each test */
  timeout: 60000, // 1 minute
  /* Global setup and teardown */
  globalSetup: require.resolve('./framework/utils/globalSetup'),
  globalTeardown: require.resolve('./framework/utils/globalTeardown'),
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only - increase retries for stability */
  retries: process.env.CI ? 3 : selectedProfile.retries,
  /* Opt out of parallel tests on CI - but allow 2 workers for better resource utilization */
  workers: process.env.CI ? 2 : selectedProfile.parallel,
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

    /* Browser headless mode - force headless in CI environments */
    headless: process.env.CI ? true : selectedProfile.headless,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: selectedProfile.screenshotOnFail ? 'only-on-failure' : 'off',
    
    /* Record video on failure */
    video: selectedProfile.videoOnFail ? 'retain-on-failure' : 'off',
    
    /* Global timeout for each action - increase for CI */
    actionTimeout: process.env.CI ? 120000 : 90000,
    
    /* Global timeout for navigation - increase for CI */
    navigationTimeout: process.env.CI ? 120000 : 90000,

    /* Element highlighting for debugging - handled in BasePage.ts */

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