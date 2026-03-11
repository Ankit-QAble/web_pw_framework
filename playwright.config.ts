import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import { envConfig } from './framework/utils/EnvConfig';

// Environment profiles inspired by user's desired schema
// Select via RUN (preferred) or NODE_ENV. Defaults to 'development'.
function substituteEnvVars(content: string): string {
  return content.replace(/\${([A-Z0-9_]+)(?::-([^}]+))?}/g, (match, key, defaultValue) => {
    return envConfig.get(key, defaultValue || '');
  });
}

const selectedProfileName = (process.env.RUN || process.env.NODE_ENV || 'development') as string;
const configFileName = `config.${selectedProfileName}.yaml`;
const configPath = path.join(process.cwd(), configFileName);

if (!fs.existsSync(configPath)) {
  throw new Error(`Configuration file not found: ${configFileName}. Please check your RUN or NODE_ENV environment variables.`);
}

const rawConfig = fs.readFileSync(configPath, 'utf8');
const substitutedConfig = substituteEnvVars(rawConfig);
const selectedProfile = yaml.load(substitutedConfig) as any;

// Override browser from command line if BROWSER environment variable is set
const commandLineBrowser = process.env.BROWSER;
if (commandLineBrowser) {
  (selectedProfile as any).browser = commandLineBrowser;
  console.log(`🔧 Browser overridden from command line: ${commandLineBrowser}`);
}

// Override mobile device from command line if MOBILE_DEVICE environment variable is set
const commandLineMobileDevice = process.env.MOBILE_DEVICE;
const commandLineViewportWidth = process.env.VIEWPORT_WIDTH;
const commandLineViewportHeight = process.env.VIEWPORT_HEIGHT;

if (commandLineMobileDevice || commandLineViewportWidth || commandLineViewportHeight) {
  // Enable mobile mode if device is specified
  if (commandLineMobileDevice) {
    if (!(selectedProfile as any).mobile) {
      (selectedProfile as any).mobile = { mobile: { isMobile: true } };
    }
    (selectedProfile as any).mobile.mobile.device = commandLineMobileDevice;
    // Disable grid when mobile device is specified (mobile tests should run locally)
    if ((selectedProfile as any).grid) {
      (selectedProfile as any).grid.isGrid = false;
      console.log('📱 Disabled grid mode for mobile testing');
    }
    console.log(`📱 Mobile device overridden from command line: ${commandLineMobileDevice}`);
  }
  
  // Add custom viewport dimensions if specified
  if (commandLineViewportWidth || commandLineViewportHeight) {
    if (!(selectedProfile as any).mobile) {
      (selectedProfile as any).mobile = { mobile: { isMobile: true } };
    }
    // Disable grid when using custom viewport (mobile mode)
    if ((selectedProfile as any).grid && !commandLineMobileDevice) {
      (selectedProfile as any).grid.isGrid = false;
      console.log('📱 Disabled grid mode for mobile viewport testing');
    }
    if (commandLineViewportWidth) {
      (selectedProfile as any).mobile.mobile.viewportWidth = parseInt(commandLineViewportWidth);
      console.log(`📐 Viewport width set: ${commandLineViewportWidth}px`);
    }
    if (commandLineViewportHeight) {
      (selectedProfile as any).mobile.mobile.viewportHeight = parseInt(commandLineViewportHeight);
      console.log(`📐 Viewport height set: ${commandLineViewportHeight}px`);
    }
  }
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
        accessKey: providerConfig.key
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
        accessKey: providerConfig.key
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
      
      console.log('   Provider: LambdaTest');
      console.log('   WebSocket Endpoint: wss://cdp.lambdatest.com/playwright?capabilities=...');
      console.log(`   Credentials: Embedded in capabilities JSON (user: ${providerConfig.user})`);
    } else if (provider === 'browserstack') {
      // BrowserStack WebSocket endpoint
      const capabilitiesStr = encodeURIComponent(JSON.stringify(capabilities));
      wsEndpoint = `wss://cdp.browserstack.com/playwright?caps=${capabilitiesStr}`;
      projectName = 'browserstack-grid';
      
      console.log('   Provider: BrowserStack');
      console.log('   WebSocket Endpoint: wss://cdp.browserstack.com/playwright?caps=...');
      console.log(`   Credentials: Embedded in capabilities JSON (user: ${providerConfig.user})`);
    } else {
      throw new Error(`Unsupported grid provider: ${provider}`);
    }
    
    return {
      name: projectName,
      use: {
        connectOptions: {
          wsEndpoint: wsEndpoint
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
  'iphone12': 'iPhone 12',
  'iphone 14 pro': 'iPhone 14 Pro',
  'ipad mini': 'iPad Mini'
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
  const overrides: Record<string, unknown> = { ...(m || {}) };
  delete (overrides as any).isMobile;
  delete (overrides as any).device;
  delete (overrides as any).viewportWidth;
  delete (overrides as any).viewportHeight;
  
  // Support custom viewport dimensions from environment or config
  const customViewportWidth = process.env.VIEWPORT_WIDTH 
    ? parseInt(process.env.VIEWPORT_WIDTH) 
    : m?.viewportWidth;
  const customViewportHeight = process.env.VIEWPORT_HEIGHT 
    ? parseInt(process.env.VIEWPORT_HEIGHT) 
    : m?.viewportHeight;
  
  const viewport: any = {};
  if (customViewportWidth) viewport.width = customViewportWidth;
  if (customViewportHeight) viewport.height = customViewportHeight;
  
  return { 
    ...baseDevice,
    ...overrides,
    ...(Object.keys(viewport).length > 0 ? { viewport } : {}),
    // enforce mobile characteristics
    isMobile: true,
    hasTouch: true
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

// Build projects conditionally: keep project names stable (chromium/firefox/webkit) for IDE compatibility
const isMobileMode = ((selectedProfile as any).mobile?.mobile ?? (selectedProfile as any).mobile)?.isMobile;
const gridCfg = (selectedProfile as any).grid;
const baseProject = mapBrowserToProject(selectedProfile.browser, gridCfg);
let computedProjects: any[] = [];

if (isMobileMode) {
  computedProjects = [{
    ...baseProject,
    use: {
      ...(baseProject as any).use,
      ...resolveMobileUse((selectedProfile as any).mobile)
    }
  }];
} else {
  // If BROWSER is explicitly set, keep a single project. Otherwise:
  // - Respect the browser from the selected profile by default
  // - Allow opting into all three browsers via RUN_ALL_BROWSERS=true
  const cliBrowser = (process.env.BROWSER || '').toLowerCase();
  const runAllBrowsers = (process.env.RUN_ALL_BROWSERS || '').toLowerCase() === 'true';
  if (cliBrowser) {
    computedProjects = [mapBrowserToProject(cliBrowser, gridCfg)];
  } else if (runAllBrowsers) {
    computedProjects = [
      mapBrowserToProject('chromium', gridCfg),
      mapBrowserToProject('firefox', gridCfg),
      mapBrowserToProject('webkit', gridCfg)
    ];
  } else {
    computedProjects = [baseProject];
  }
}

// Log mobile configuration if enabled
if (isMobileMode) {
  const mobileConfig = (selectedProfile as any).mobile?.mobile ?? (selectedProfile as any).mobile;
  const deviceName = mobileConfig?.device || 'default';
  const viewport = mobileConfig?.viewport || {};
  console.log('📱 Mobile Mode: ENABLED');
  console.log(`   Device: ${deviceName}`);
  if (viewport.width || mobileConfig?.viewportWidth) {
    console.log(`   Viewport: ${viewport.width || mobileConfig?.viewportWidth}x${viewport.height || mobileConfig?.viewportHeight}`);
  }
}

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './test/specs',
  /* Global timeout for each test */
  timeout: process.env.CI ? 600000 : 600000, // 10 minutes for CI, 10 minutes for local
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
    ['list'],
    ['html'],
    ['allure-playwright', { detail: true, outputFolder: 'allure-results', suiteTitle: false }],
    ['json', { outputFile: 'test-results/report.json' }],
    ['./framework/reporters/EmailReporter.ts'],
    ['json', {  outputFile: 'test-results.json' }],
    [
      './reporters/tesbo-uploader-v3',  // Uploads after run from json report
      {
        apiKey: 'tesbo_vChVaxeIW18DY_-6QVZa_WylpAN6JXd5', // Local API key for testing
        apiKeyEnv: 'TESBO_API_KEY',
        reportingPortalUrl: 'https://whitebox.bettercases.ai/',  // Use HTTPS to avoid redirect/downgrade issues
        runTitle: process.env.TESBO_RUN_TITLE || 'Local Playwright Test Run'
      }
    ]

  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: selectedProfile.baseURL,

    /* Browser headless mode - force headless in CI environments */
    headless: process.env.HEADLESS === 'true' ? true : process.env.HEADLESS === 'false' ? false : (process.env.CI ? true : selectedProfile.headless),

    trace: (selectedProfile as any).grid?.isGrid
      ? 'off'
      : (String(((selectedProfile as any).Artifacts) || '').toLowerCase() === 'on' ? 'on' : 'retain-on-failure'),
    
    screenshot: (selectedProfile as any).grid?.isGrid
      ? 'off'
      : (String(((selectedProfile as any).Artifacts) || '').toLowerCase() === 'on' ? 'on' : 'only-on-failure'),
    
    video: (selectedProfile as any).grid?.isGrid
      ? 'off'
      : (String(((selectedProfile as any).Artifacts) || '').toLowerCase() === 'on' ? 'on' : 'retain-on-failure'),
    
    /* Global timeout for each action - reduce for local to speed up failures */
    actionTimeout: process.env.CI ? 120000 : 30000,
    
    /* Global timeout for navigation - reduce for local to speed up failures */
    navigationTimeout: process.env.CI ? 180000 : 45000

    /* Element highlighting for debugging - handled in BasePage.ts */

    /* Optionally grant common permissions */
    //permissions: selectedProfile.autoGrantPermissions ? ['geolocation', 'notifications', 'camera', 'microphone'] : undefined,
  },

  /* Configure projects for major browsers */
  projects: computedProjects

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
