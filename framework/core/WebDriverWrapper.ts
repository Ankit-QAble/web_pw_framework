import { Browser, BrowserContext, Page, chromium, firefox, webkit, BrowserType } from '@playwright/test';
import { Logger } from '../utils/Logger';

export type BrowserName = 'chromium' | 'firefox' | 'webkit';

export interface BrowserOptions {
  headless?: boolean;
  slowMo?: number;
  devtools?: boolean;
  timeout?: number;
  viewport?: { width: number; height: number };
  userAgent?: string;
  locale?: string;
  timezoneId?: string;
}

export interface ContextOptions {
  viewport?: { width: number; height: number };
  userAgent?: string;
  locale?: string;
  timezoneId?: string;
  permissions?: string[];
  geolocation?: { latitude: number; longitude: number };
  colorScheme?: 'light' | 'dark' | 'no-preference';
  extraHTTPHeaders?: Record<string, string>;
  httpCredentials?: { username: string; password: string };
  storageState?: string | { cookies: any[]; origins: any[] };
}

export class WebDriverWrapper {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private logger: Logger;

  constructor() {
    this.logger = new Logger('WebDriverWrapper');
  }

  /**
   * Launch browser
   */
  async launchBrowser(
    browserName: BrowserName = 'chromium',
    options: BrowserOptions = {}
  ): Promise<Browser> {
    this.logger.info(`Launching ${browserName} browser`);
    
    const browserType = this.getBrowserType(browserName);
    const defaultOptions = {
      headless: process.env.HEADLESS !== 'false',
      slowMo: 0,
      devtools: false,
      timeout: 30000,
      ...options
    };

    this.browser = await browserType.launch(defaultOptions);
    this.logger.info(`${browserName} browser launched successfully`);
    return this.browser;
  }

  /**
   * Create browser context
   */
  async createContext(options: ContextOptions = {}): Promise<BrowserContext> {
    if (!this.browser) {
      throw new Error('Browser not launched. Call launchBrowser() first.');
    }

    this.logger.info('Creating browser context');
    const defaultOptions = {
      viewport: { width: 1920, height: 1080 },
      locale: 'en-US',
      timezoneId: 'America/New_York',
      ...options
    };

    this.context = await this.browser.newContext(defaultOptions);
    this.logger.info('Browser context created successfully');
    return this.context;
  }

  /**
   * Create new page
   */
  async createPage(): Promise<Page> {
    if (!this.context) {
      throw new Error('Browser context not created. Call createContext() first.');
    }

    this.logger.info('Creating new page');
    this.page = await this.context.newPage();
    
    // Set up page event listeners
    this.setupPageEventListeners(this.page);
    
    this.logger.info('New page created successfully');
    return this.page;
  }

  /**
   * Get current page
   */
  getCurrentPage(): Page {
    if (!this.page) {
      throw new Error('Page not created. Call createPage() first.');
    }
    return this.page;
  }

  /**
   * Get current context
   */
  getCurrentContext(): BrowserContext {
    if (!this.context) {
      throw new Error('Context not created. Call createContext() first.');
    }
    return this.context;
  }

  /**
   * Get current browser
   */
  getCurrentBrowser(): Browser {
    if (!this.browser) {
      throw new Error('Browser not launched. Call launchBrowser() first.');
    }
    return this.browser;
  }

  /**
   * Close current page
   */
  async closePage(): Promise<void> {
    if (this.page) {
      this.logger.info('Closing current page');
      await this.page.close();
      this.page = null;
    }
  }

  /**
   * Close browser context
   */
  async closeContext(): Promise<void> {
    if (this.context) {
      this.logger.info('Closing browser context');
      await this.context.close();
      this.context = null;
      this.page = null;
    }
  }

  /**
   * Close browser
   */
  async closeBrowser(): Promise<void> {
    if (this.browser) {
      this.logger.info('Closing browser');
      await this.browser.close();
      this.browser = null;
      this.context = null;
      this.page = null;
    }
  }

  /**
   * Clean up all resources
   */
  async cleanup(): Promise<void> {
    this.logger.info('Cleaning up WebDriver resources');
    await this.closePage();
    await this.closeContext();
    await this.closeBrowser();
  }

  /**
   * Get browser type based on name
   */
  private getBrowserType(browserName: BrowserName): BrowserType {
    switch (browserName) {
      case 'chromium':
        return chromium;
      case 'firefox':
        return firefox;
      case 'webkit':
        return webkit;
      default:
        throw new Error(`Unsupported browser: ${browserName}`);
    }
  }

  /**
   * Setup page event listeners
   */
  private setupPageEventListeners(page: Page): void {
    page.on('console', msg => {
      this.logger.info(`Console ${msg.type()}: ${msg.text()}`);
    });

    page.on('pageerror', error => {
      this.logger.error(`Page error: ${error.message}`);
    });

    page.on('requestfailed', request => {
      this.logger.warn(`Request failed: ${request.url()} - ${request.failure()?.errorText}`);
    });

    page.on('response', response => {
      if (response.status() >= 400) {
        this.logger.warn(`HTTP ${response.status()}: ${response.url()}`);
      }
    });
  }

  /**
   * Set extra HTTP headers for all requests
   */
  async setExtraHTTPHeaders(headers: Record<string, string>): Promise<void> {
    if (!this.page) {
      throw new Error('Page not created. Call createPage() first.');
    }
    
    this.logger.info(`Setting extra HTTP headers: ${JSON.stringify(headers)}`);
    await this.page.setExtraHTTPHeaders(headers);
  }

  /**
   * Set user agent
   */
  async setUserAgent(userAgent: string): Promise<void> {
    if (!this.context) {
      throw new Error('Context not created. Call createContext() first.');
    }
    
    this.logger.info(`Setting user agent: ${userAgent}`);
    // In Playwright, user agent must be set at context level, not page level
    // This method will create a new context with the specified user agent
    await this.closeContext();
    this.context = await this.browser!.newContext({ userAgent });
    this.page = await this.context.newPage();
  }

  /**
   * Set viewport size
   */
  async setViewportSize(width: number, height: number): Promise<void> {
    if (!this.page) {
      throw new Error('Page not created. Call createPage() first.');
    }
    
    this.logger.info(`Setting viewport size: ${width}x${height}`);
    await this.page.setViewportSize({ width, height });
  }

  /**
   * Enable/disable JavaScript
   */
  async setJavaScriptEnabled(enabled: boolean): Promise<void> {
    if (!this.context) {
      throw new Error('Context not created. Call createContext() first.');
    }
    
    this.logger.info(`Setting JavaScript enabled: ${enabled}`);
    await this.context.addInitScript(`
      if (!${enabled}) {
        Object.defineProperty(window, 'navigator', {
          value: new Proxy(navigator, {
            get: (target, prop) => {
              if (prop === 'javaEnabled') {
                return () => false;
              }
              return target[prop];
            }
          })
        });
      }
    `);
  }
}