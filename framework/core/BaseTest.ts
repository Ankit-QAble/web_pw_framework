import { test as base, Page, BrowserContext } from '@playwright/test';
import { Logger } from '../utils/Logger';
import { ScreenshotHelper } from '../utils/ScreenshotHelper';

export interface TestFixtures {
  logger: Logger;
  screenshotHelper: ScreenshotHelper;
}

export const test = base.extend<TestFixtures>({
  logger: async ({}, use, testInfo) => {
    const logger = new Logger(testInfo.title);
    logger.info(`Starting test: ${testInfo.title}`);
    await use(logger);
    logger.info(`Test completed: ${testInfo.title}`);
  },

  screenshotHelper: async ({ page }, use, testInfo) => {
    const screenshotHelper = new ScreenshotHelper(page, testInfo);
    await use(screenshotHelper);
  },
});

export abstract class BaseTest {
  protected page: Page;
  protected context: BrowserContext;
  protected logger: Logger;

  constructor(page: Page, context: BrowserContext, logger: Logger) {
    this.page = page;
    this.context = context;
    this.logger = logger;
  }

  /**
   * Setup method to be called before each test
   */
  async setup(): Promise<void> {
    this.logger.info('Setting up test');
    // Override in child classes for specific setup
  }

  /**
   * Teardown method to be called after each test
   */
  async teardown(): Promise<void> {
    this.logger.info('Tearing down test');
    // Override in child classes for specific teardown
  }

  /**
   * Navigate to URL
   */
  async navigateTo(url: string): Promise<void> {
    this.logger.info(`Navigating to: ${url}`);
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for specified time
   */
  async wait(milliseconds: number): Promise<void> {
    this.logger.info(`Waiting for ${milliseconds}ms`);
    await this.page.waitForTimeout(milliseconds);
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    const title = await this.page.title();
    this.logger.info(`Page title: ${title}`);
    return title;
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    const url = this.page.url();
    this.logger.info(`Current URL: ${url}`);
    return url;
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name?: string): Promise<void> {
    const screenshotName = name || `test-screenshot-${Date.now()}`;
    this.logger.info(`Taking screenshot: ${screenshotName}`);
    await this.page.screenshot({ 
      path: `screenshots/${screenshotName}.png`, 
      fullPage: true 
    });
  }

  /**
   * Clear browser data
   */
  async clearBrowserData(): Promise<void> {
    this.logger.info('Clearing browser data');
    await this.context.clearCookies();
    await this.context.clearPermissions();
  }

  /**
   * Set viewport size
   */
  async setViewportSize(width: number, height: number): Promise<void> {
    this.logger.info(`Setting viewport size: ${width}x${height}`);
    await this.page.setViewportSize({ width, height });
  }

  /**
   * Reload page
   */
  async reloadPage(): Promise<void> {
    this.logger.info('Reloading page');
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    this.logger.info('Going back in browser history');
    await this.page.goBack();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Go forward in browser history
   */
  async goForward(): Promise<void> {
    this.logger.info('Going forward in browser history');
    await this.page.goForward();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Execute JavaScript in browser
   */
  async executeScript(script: string): Promise<any> {
    this.logger.info(`Executing script: ${script}`);
    return await this.page.evaluate(script);
  }

  /**
   * Handle dialog (alert, confirm, prompt)
   */
  async handleDialog(accept: boolean = true, promptText?: string): Promise<void> {
    this.page.on('dialog', async dialog => {
      this.logger.info(`Dialog appeared: ${dialog.message()}`);
      if (dialog.type() === 'prompt' && promptText) {
        await dialog.accept(promptText);
      } else if (accept) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  }
}

export { expect } from '@playwright/test';