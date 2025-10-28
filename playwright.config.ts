import { defineConfig, devices } from '@playwright/test';
import { envConfig } from './framework/utils/EnvConfig';

// Environment profiles inspired by user's desired schema
// Select via RUN (preferred) or NODE_ENV. Defaults to 'development'.
const PROFILES = {
  development: {
    baseURL: 'http://devwebpanel.sadadqa.com:3004/auth/login',
    browser: 'chrome', // 'chrome'|'chromium'|'firefox'|'webkit'
    headless: false,
    parallel: 1, // workers
    retries: 0,
    screenshotOnFail: true,
    videoOnFail: true,
    elementHighlight: true,
    reportEmail: {
      email: false, // Set to true to enable email reporting and setup in utils/EmailService.ts
      to: ['patelankitr123@gmail.com'],
      subject: 'Automation Test Report',
      body: 'Test execution completed for development environment',
    },
    reportSmtp: envConfig.getSmtpConfig(),
    grid: {
      isGrid: false,
      provider: 'lambdatest', // 'lambdatest' | 'browserstack'
      
      // LambdaTest Configuration
      lambdatest: {
        user: 'ankitpatel',
        key: '<YOUR_LAMBDATEST_ACCESS_KEY>',
        capabilities: {
          'LT:Options': {
            platform: 'Windows 10',
            browserName: 'Chrome',
            browserVersion: 'latest',
            resolution: '1920x1080',
            name: 'Playwright Login Tests',
            build: 'Login Test',
            projectName: 'Web Framework',
            console: true,
            network: true,
            visual: true,
            video: true,
          }
        }
      },
      
      // BrowserStack Configuration
      browserstack: {
        user: 'ankitpatel_4ZJ9iA',
        key: 'xxscKnMDQvxks5d6eADR',
        capabilities: {
          'bstack:options': {
            os: 'Windows',
            osVersion: '10',
            browserName: 'chrome',
            browserVersion: 'latest',
            resolution: '1920x1080',
            projectName: 'Web Framework',
            buildName: 'Development Build',
            sessionName: 'Playwright Development Tests',
            local: false,
            networkLogs: true,
            consoleLogs: 'info',
            video: true,
          }
        }
      }
    }
  },
  preprod: {
    baseURL: 'https://qable.io',
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
      to: ['ankitpatel@qable.io'],
      subject: 'Preprod Test Report - Allure Results',
      body: 'Test execution completed for preprod environment. Allure report attached.',
    },
    reportSmtp: envConfig.getSmtpConfig(),
    grid: {
      isGrid: false,
      provider: 'lambdatest', // 'lambdatest' | 'browserstack'
      
      // LambdaTest Configuration
      lambdatest: {
        user: 'ankitpatel',
        key: '<YOUR_LAMBDATEST_ACCESS_KEY>',
        capabilities: {
          'LT:Options': {
            platform: 'Windows 10',
            browserName: 'Chrome',
            browserVersion: 'latest',
            resolution: '1920x1080',
            name: 'Playwright Preprod Tests',
            build: 'Preprod Build',
            projectName: 'Web Framework',
            console: true,
            network: true,
            visual: true,
            video: true,
          }
        }
      },
      
      // BrowserStack Configuration
      browserstack: {
        user: 'your-browserstack-username',
        key: 'your-browserstack-access-key',
        capabilities: {
          'bstack:options': {
            os: 'Windows',
            osVersion: '10',
            browserName: 'chrome',
            browserVersion: 'latest',
            resolution: '1920x1080',
            projectName: 'Web Framework',
            buildName: 'Preprod Build',
            sessionName: 'Playwright Preprod Tests',
            local: false,
            networkLogs: true,
            consoleLogs: 'info',
            video: true,
          }
        }
      }
    }
  },
  qable: {
    baseURL: 'https://www.qable.io/blog',
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
      to: ['ankitpatel@qable.io'],
      subject: 'Preprod Test Report - Allure Results',
      body: 'Test execution completed for preprod environment. Allure report attached.',
    },
    reportSmtp: envConfig.getSmtpConfig(),
    grid: {
      isGrid: false,
      provider: 'lambdatest', // 'lambdatest' | 'browserstack'
      
      // LambdaTest Configuration
      lambdatest: {
        user: 'ankitpatelsadad',
        key: '<YOUR_LAMBDATEST_ACCESS_KEY>',
        capabilities: {
          'LT:Options': {
            platform: 'Windows 10',
            browserName: 'Chrome',
            browserVersion: 'latest',
            resolution: '1920x1080',
            name: 'Playwright Preprod Tests',
            build: 'Preprod Build',
            projectName: 'Web Framework',
            console: true,
            network: true,
            visual: true,
            video: true,
          }
        }
      },
      
      // BrowserStack Configuration
      browserstack: {
        user: 'your-browserstack-username',
        key: 'your-browserstack-access-key',
        capabilities: {
          'bstack:options': {
            os: 'Windows',
            osVersion: '10',
            browserName: 'chrome',
            browserVersion: 'latest',
            resolution: '1920x1080',
            projectName: 'Web Framework',
            buildName: 'Preprod Build',
            sessionName: 'Playwright Preprod Tests',
            local: false,
            networkLogs: true,
            consoleLogs: 'info',
            video: true,
          }
        }
      }
    }
  },
} as const;

type ProfileName = keyof typeof PROFILES;
const selectedProfileName: ProfileName = (process.env.RUN as ProfileName) || (process.env.NODE_ENV as ProfileName) || 'development';
const selectedProfile = { ...PROFILES[selectedProfileName] || PROFILES.development };

// Override browser from command line if BROWSER environment variable is set
const commandLineBrowser = process.env.BROWSER;
if (commandLineBrowser) {
  (selectedProfile as any).browser = commandLineBrowser;
  console.log(`🔧 Browser overridden from command line: ${commandLineBrowser}`);
}

// Expose profile baseURL to rest of code via env for utilities
process.env.BASE_URL = selectedProfile.baseURL;

// Add selectedProfile to config for global setup/teardown
(global as any).selectedProfile = selectedProfile;

// Function to build grid capabilities based on provider
function buildGridCapabilities(gridConfig: any, browser: string) {
  const provider = gridConfig?.provider || 'lambdatest';
  const providerConfig = gridConfig?.[provider];
  
  if (!providerConfig) {
    throw new Error(`Grid provider '${provider}' configuration not found`);
  }
  
  if (provider === 'lambdatest') {
    const capabilities = providerConfig?.capabilities?.['LT:Options'] || {};
    return {
      browserName: capabilities.browserName || browser,
      browserVersion: capabilities.browserVersion || 'latest',
      'LT:Options': {
        ...capabilities,
        user: providerConfig.user,
        accessKey: providerConfig.key,
      }
    };
  }
  
  if (provider === 'browserstack') {
    const capabilities = providerConfig?.capabilities?.['bstack:options'] || {};
    return {
      browser: capabilities.browserName || browser,
      browser_version: capabilities.browserVersion || 'latest',
      'bstack:options': {
        ...capabilities,
        userName: providerConfig.user,
        accessKey: providerConfig.key,
      }
    };
  }
  
  throw new Error(`Unsupported grid provider: ${provider}`);
}

function mapBrowserToProject(browser: string, gridConfig?: any) {
  const b = browser?.toLowerCase();
  
  // If grid is enabled, return grid configuration
  if (gridConfig?.isGrid) {
    const provider = gridConfig?.provider || 'lambdatest';
    const providerConfig = gridConfig?.[provider];
    const capabilities = buildGridCapabilities(gridConfig, b);
    
    let wsEndpoint: string;
    let projectName: string;
    
    if (provider === 'lambdatest') {
      // LambdaTest WebSocket endpoint
      const capabilitiesStr = encodeURIComponent(JSON.stringify(capabilities));
      wsEndpoint = `wss://cdp.lambdatest.com/playwright?capabilities=${capabilitiesStr}`;
      projectName = 'lambdatest-grid';
      
      console.log(`   Provider: LambdaTest`);
      console.log(`   WebSocket Endpoint: wss://cdp.lambdatest.com/playwright?capabilities=...`);
      console.log(`   Credentials: Embedded in capabilities JSON (user: ${providerConfig.user})`);
    } else if (provider === 'browserstack') {
      // BrowserStack WebSocket endpoint
      const capabilitiesStr = encodeURIComponent(JSON.stringify(capabilities));
      wsEndpoint = `wss://cdp.browserstack.com/playwright?caps=${capabilitiesStr}`;
      projectName = 'browserstack-grid';
      
      console.log(`   Provider: BrowserStack`);
      console.log(`   WebSocket Endpoint: wss://cdp.browserstack.com/playwright?caps=...`);
      console.log(`   Credentials: Embedded in capabilities JSON (user: ${providerConfig.user})`);
    } else {
      throw new Error(`Unsupported grid provider: ${provider}`);
    }
    
    return {
      name: projectName,
      use: {
        connectOptions: {
          wsEndpoint: wsEndpoint,
        }
      }
    };
  }
  
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
      '--disable-features=VizDisplayCompositor',
      '--disable-extensions',
      '--disable-plugins',
      '--disable-images',
      '--disable-default-apps',
      '--disable-sync',
      '--disable-translate',
      '--hide-scrollbars',
      '--mute-audio',
      '--no-default-browser-check',
      '--disable-logging',
      '--disable-permissions-api',
      '--disable-presentation-api',
      '--disable-print-preview',
      '--disable-speech-api',
      '--disable-file-system',
      '--disable-client-side-phishing-detection',
      '--disable-component-update',
      '--disable-domain-reliability',
      '--disable-features=AudioServiceOutOfProcess',
      '--disable-hang-monitor',
      '--disable-prompt-on-repost',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--disable-backgrounding-occluded-windows',
      '--disable-client-side-phishing-detection',
      '--disable-sync-preferences',
      '--disable-default-apps',
      '--disable-extensions',
      '--disable-plugins',
      '--disable-web-security',
      '--disable-features=TranslateUI',
      '--disable-ipc-flooding-protection',
      '--memory-pressure-off',
      '--max_old_space_size=4096',
      '--disable-features=VizDisplayCompositor'
    ],
    // Add timeout for browser launch
    timeout: 60000,
    // Add slowMo to reduce resource pressure
    slowMo: process.env.CI ? 100 : 0
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
          args: [
            '-headless',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
          ],
          timeout: 60000
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

// Log grid configuration status
if ((selectedProfile as any).grid?.isGrid) {
  const gridConfig = (selectedProfile as any).grid;
  const provider = gridConfig?.provider || 'lambdatest';
  const providerConfig = gridConfig?.[provider];
  
  if (provider === 'lambdatest') {
    const ltOptions = providerConfig?.capabilities?.['LT:Options'];
    console.log('🌐 Grid Mode: ENABLED - Tests will run on LambdaTest');
    console.log(`   Platform: ${ltOptions?.platform}`);
    console.log(`   Browser: ${ltOptions?.browserName} ${ltOptions?.browserVersion}`);
    console.log(`   Build: ${ltOptions?.build}`);
  } else if (provider === 'browserstack') {
    const bsOptions = providerConfig?.capabilities?.['bstack:options'];
    console.log('🌐 Grid Mode: ENABLED - Tests will run on BrowserStack');
    console.log(`   Platform: ${bsOptions?.os} ${bsOptions?.osVersion}`);
    console.log(`   Browser: ${bsOptions?.browserName} ${bsOptions?.browserVersion}`);
    console.log(`   Build: ${bsOptions?.buildName}`);
  }
} else {
  console.log('💻 Grid Mode: DISABLED - Tests will run locally');
}

// Build projects conditionally: if mobile specified and isMobile==true, use that; else use desktop from profile
const computedProjects = ((selectedProfile as any).mobile?.mobile ?? (selectedProfile as any).mobile)?.isMobile
  ? [
      {
        name: 'mobile-profile',
        use: resolveMobileUse((selectedProfile as any).mobile),
      },
    ]
  : [mapBrowserToProject(selectedProfile.browser, (selectedProfile as any).grid)];

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './test/specs',
  /* Global timeout for each test */
  timeout: process.env.CI ? 120000 : 60000, // 2 minutes for CI, 1 minute for local
  /* Global setup and teardown */
  globalSetup: require.resolve('./framework/utils/globalSetup'),
  globalTeardown: require.resolve('./framework/utils/globalTeardown'),
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only - increase retries for stability */
  retries: selectedProfile.retries,
  /* Opt out of parallel tests on CI - but allow 2 workers for better resource utilization */
  workers: selectedProfile.parallel,
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
    headless: process.env.HEADLESS === 'true' ? true : process.env.HEADLESS === 'false' ? false : (process.env.CI ? true : selectedProfile.headless),

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    
    /* Take screenshot on failure - disable on grid as LambdaTest handles it */
    screenshot: (selectedProfile as any).grid?.isGrid ? 'off' : (selectedProfile.screenshotOnFail ? 'only-on-failure' : 'off'),
    
    /* Record video on failure - disable on grid as LambdaTest handles it */
    video: (selectedProfile as any).grid?.isGrid ? 'off' : (selectedProfile.videoOnFail ? 'retain-on-failure' : 'off'),
    
    /* Global timeout for each action - increase for CI */
    actionTimeout: process.env.CI ? 120000 : 90000,
    
    /* Global timeout for navigation - increase for CI */
    navigationTimeout: process.env.CI ? 180000 : 90000,

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
