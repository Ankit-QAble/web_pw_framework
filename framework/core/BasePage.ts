import { Page, Locator, expect, TestInfo } from '@playwright/test';
import { Logger } from '../utils/Logger';
import { ScreenshotHelper } from '../utils/ScreenshotHelper';

export abstract class BasePage {
  protected page: Page;
  protected logger: Logger;
  protected url?: string;
  protected screenshotHelper?: ScreenshotHelper;

  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    this.page = page;
    this.url = url;
    this.logger = new Logger(this.constructor.name);
    if (testInfo) {
      this.screenshotHelper = new ScreenshotHelper(page, testInfo);
    }
  }
  
  /**
   * Get locator for the specified selector
   * @param selector The selector string or locator object
   * @returns Locator object
   */
  protected getLocator(selector: string | Locator): Locator {
    if (typeof selector === 'string') {
      return this.page.locator(selector);
    }
    return selector;
  }
  
  /**
   * Click on an element
   * @param selector The selector string or locator object
   */
  protected async click(selector: string | Locator): Promise<void> {
    const locator = this.getLocator(selector);
    this.logger.info(`Clicking on element: ${selector}`);
    await locator.click();
  }
  
  /**
   * Fill a form field
   * @param selector The selector string or locator object
   * @param value The value to fill
   */
  protected async fill(selector: string | Locator, value: string): Promise<void> {
    const locator = this.getLocator(selector);
    this.logger.info(`Filling element: ${selector} with value: ${value}`);
    await locator.fill(value);
  }
  
  /**
   * Check if element is visible
   * @param selector The selector string or locator object
   * @returns True if element is visible
   */
  protected async isVisible(selector: string | Locator): Promise<boolean> {
    const locator = this.getLocator(selector);
    return await locator.isVisible();
  }
  
  /**
   * Get text from an element
   * @param selector The selector string or locator object
   * @returns Text content of the element
   */
  protected async getText(selector: string | Locator): Promise<string> {
    const locator = this.getLocator(selector);
    return await locator.textContent() || '';
  }
  
  /**
   * Wait for element to be visible
   * @param selector The selector string or locator object
   * @param timeout Optional timeout in milliseconds
   */
  protected async waitForVisible(selector: string | Locator, timeout?: number): Promise<void> {
    const locator = this.getLocator(selector);
    this.logger.info(`Waiting for element to be visible: ${selector}`);
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait until element is present in DOM (attached)
   * @param selector The selector string or locator object
   * @param timeout Optional timeout in milliseconds
   */
  async waitUntilElementPresent(selector: string | Locator, timeout?: number): Promise<void> {
    const locator = this.getLocator(selector);
    this.logger.info(`Waiting until element is present: ${selector}`);
    try {
      await locator.waitFor({ state: 'attached', timeout });
    } catch (error) {
      const message = `Element not present within ${timeout ?? 30000}ms: ${selector}`;
      this.logger.error(message, error as Error);
      throw new Error(message);
    }
  }

  /**
   * Wait until element is clickable (visible and enabled)
   * @param selector The selector string or locator object
   * @param timeout Optional timeout in milliseconds
   */
  async waitUntilElementClickable(selector: string | Locator, timeout?: number): Promise<void> {
    const locator = this.getLocator(selector);
    this.logger.info(`Waiting until element is clickable: ${selector}`);
    try {
      await locator.waitFor({ state: 'visible', timeout });
      await expect(locator).toBeEnabled({ timeout });
    } catch (error) {
      const message = `Element not clickable within ${timeout ?? 30000}ms: ${selector}`;
      this.logger.error(message, error as Error);
      throw new Error(message);
    }
  }
  
  /**
   * Expect element to be visible
   * @param selector The selector string or locator object
   * @param message Optional assertion message
   */
  protected async expectVisible(selector: string | Locator, message?: string): Promise<void> {
    const locator = this.getLocator(selector);
    await expect(locator, message).toBeVisible();
  }
  
  /**
   * Select option from dropdown
   * @param selector The selector string or locator object
   * @param value The value to select
   */
  protected async selectOption(selector: string | Locator, value: string): Promise<void> {
    const locator = this.getLocator(selector);
    this.logger.info(`Selecting option: ${value} from dropdown: ${selector}`);
    await locator.selectOption(value);
  }

  /**
   * Navigate to the page URL
   */
  async navigate(): Promise<void> {
    if (!this.url) {
      throw new Error(`URL not defined for ${this.constructor.name}`);
    }
    this.logger.info(`Navigating to: ${this.url}`);
    await this.page.goto(this.url);
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    this.logger.info('Page loaded successfully');
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
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
   * Validate element state before interaction
   */
  private async validateElementState(locator: Locator): Promise<void> {
    const isVisible = await locator.isVisible();
    if (!isVisible) {
      throw new Error(`Element is not visible: ${locator}`);
    }

    const isEnabled = await locator.isEnabled();
    if (!isEnabled) {
      throw new Error(`Element is not enabled: ${locator}`);
    }
  }

  /**
   * Create descriptive error message based on error type
   */
  private createFillErrorMessage(errorMessage: string, locator: Locator): Error {
    if (errorMessage.includes('Timeout')) {
      return new Error(`Timeout waiting for element to be visible: ${locator}. Element may not exist or is not accessible.`);
    } else if (errorMessage.includes('not visible')) {
      return new Error(`Element is not visible and cannot be filled: ${locator}`);
    } else if (errorMessage.includes('not enabled')) {
      return new Error(`Element is disabled and cannot be filled: ${locator}`);
    } else {
      return new Error(`Failed to fill element: ${errorMessage}`);
    }
  }

  /**
   * Check if element is enabled
   */
  async isEnabled(locator: Locator): Promise<boolean> {
    try {
      const isEnabled = await locator.isEnabled();
      this.logger.info(`Element enabled: ${isEnabled}`);
      return isEnabled;
    } catch (error) {
      this.logger.error(`Error checking if enabled: ${error}`);
      return false;
    }
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name?: string, timeout=10): Promise<string> {
    if (this.screenshotHelper) {
      // Use ScreenshotHelper for proper file saving and test attachment
      return await this.screenshotHelper.takeScreenshot(name);
    } else {
      // Fallback to basic screenshot without file saving
      const screenshotName = name || `screenshot-${Date.now()}`;
      this.logger.info(`Taking screenshot: ${screenshotName}`);
      const buffer = await this.page.screenshot({ fullPage: true });
      this.logger.warn('Screenshot taken but not saved to file (no TestInfo provided)');
      return `Screenshot taken: ${screenshotName}`;
    }
  }

  /**
   * Scroll to element
   */
  async scrollToElement(locator: Locator): Promise<void> {
    this.logger.info(`Scrolling to element: ${locator}`);
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Wait for navigation
   */
  async waitForNavigation(): Promise<void> {
    this.logger.info('Waiting for navigation');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for a specified timeout
   */
  async waitForTimeout(timeout: number): Promise<void> {
    this.logger.info(`Waiting for ${timeout}ms`);
    await this.page.waitForTimeout(timeout);
  }

  /**
   * Verify page title
   */
  async verifyTitle(expectedTitle: string): Promise<void> {
    const actualTitle = await this.getTitle();
    expect(actualTitle).toBe(expectedTitle);
    this.logger.info(`Title verified: ${expectedTitle}`);
  }

  /**
   * Verify current URL contains text
   */
  async verifyUrlContains(expectedText: string): Promise<void> {
    const currentUrl = this.getCurrentUrl();
    expect(currentUrl).toContain(expectedText);
    this.logger.info(`URL contains: ${expectedText}`);
  }

  /**
   * Get text from element and compare with expected text
   * @param selector The selector string or locator object
   * @param expectedText The text to compare against
   * @param exactMatch Whether to do exact match (default: true)
   * @returns True if text matches, false otherwise
   */
  async getTextAndCompare(selector: string | Locator, expectedText: string, exactMatch: boolean = true): Promise<boolean> {
    const locator = this.getLocator(selector);
    const actualText = await this.getText(selector);
    
    this.logger.info(`Comparing text for element: ${selector}`);
    this.logger.info(`Expected: "${expectedText}"`);
    this.logger.info(`Actual: "${actualText}"`);
    
    let isMatch: boolean;
    if (exactMatch) {
      isMatch = actualText === expectedText;
    } else {
      isMatch = actualText.includes(expectedText);
    }
    
    this.logger.info(`Text comparison result: ${isMatch ? 'MATCH' : 'NO MATCH'}`);
    return isMatch;
  }

  /**
   * Get text from element and assert it matches expected text
   * @param selector The selector string or locator object
   * @param expectedText The text to compare against
   * @param exactMatch Whether to do exact match (default: true)
   */
  async verifyText(selector: string | Locator, expectedText: string, exactMatch: boolean = true): Promise<void> {
    const locator = this.getLocator(selector);
    const actualText = await this.getText(selector);
    
    this.logger.info(`Verifying text for element: ${selector}`);
    this.logger.info(`Expected: "${expectedText}"`);
    this.logger.info(`Actual: "${actualText}"`);
    
    if (exactMatch) {
      expect(actualText).toBe(expectedText);
    } else {
      expect(actualText).toContain(expectedText);
    }
    
    this.logger.info(`Text verification passed`);
  }
}