import { Page, Locator, expect, TestInfo, FileChooser, Frame } from '@playwright/test';
import { Logger } from '../utils/Logger';
import { ScreenshotHelper } from '../utils/ScreenshotHelper';

type SelectorDefinition = string | Locator | Array<string | Locator>;

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
  protected async getLocator(selector: SelectorDefinition): Promise<Locator> {
    if (Array.isArray(selector)) {
      return await this.resolveAutoHealingSelector(selector);
    }
    if (typeof selector === 'string') {
      return this.page.locator(selector);
    }
    return selector;
  }
  /** Apply a temporary red highlight by saving previous inline style in dataset._prevStyle. */
protected async highlight(locator: Locator): Promise<void> {
  // Check if element highlighting is enabled
  const shouldHighlight = (global as any).selectedProfile?.elementHighlight;
  
  if (!shouldHighlight) {
    return; // Skip highlighting if disabled
  }
  
  await locator.evaluate((el) => {
    const elh = el as any;
    // save previous inline style so we can restore later
    elh.setAttribute('data-_prevStyle', elh.getAttribute('style') || '');
    elh.style.backgroundColor = 'yellow';
    elh.style.border = '2px solid red';
    elh.style.outline = 'none';
    elh.style.transition = 'background-color 120ms ease, border 120ms ease';
    elh.scrollIntoView({ block: 'center', inline: 'center', behavior: 'auto' });
  }).catch(() => { /* ignore if element detached */ });
}

/** Restore previous inline style saved by `highlight`. Safe to call anytime. */
protected async unhighlight(locator: Locator): Promise<void> {
  // Check if element highlighting is enabled
  const shouldHighlight = (global as any).selectedProfile?.elementHighlight;
  
  if (!shouldHighlight) {
    return; // Skip unhighlighting if disabled
  }
  
  await locator.evaluate((el) => {
    const elh = el as any;
    const prev = elh.getAttribute('data-_prevStyle') || '';
    elh.setAttribute('style', prev);
    elh.removeAttribute('data-_prevStyle');
  }).catch(() => { /* ignore if element detached or already removed */ });
}
  
  /**
   * Click on an element
   * @param selector The selector string or locator object
   * @param timeout Optional timeout in milliseconds (default: 5000ms)
   */
  protected async click(selector: SelectorDefinition, timeout: number = 5000): Promise<void> {
    const locator = await this.getLocator(selector);
    this.logger.info(`Clicking on element: ${this.describeSelector(selector)}`);
    //await locator.waitFor({ state: 'visible', timeout });
    await locator.click();
  }
  
  /**
   * Fill a form field
   * @param selector The selector string or locator object
   * @param value The value to fill
   * @param timeout Optional timeout in milliseconds (default: 5000ms)
   */
  protected async fill(selector: SelectorDefinition, value: string, timeout: number = 5000): Promise<void> {
    const locator = await this.getLocator(selector);
    this.logger.info(`Filling element: ${this.describeSelector(selector)} with value: ${value}`);
  
    await locator.waitFor({ state: 'visible', timeout });
    await this.highlight(locator);
    try {
      await locator.fill(value);
      // optional small pause so the highlight is visible during the action
      if (this.page) await this.page.waitForTimeout(150);
    } finally {
      await this.unhighlight(locator);
    }
  }

  /**
   * Upload file(s) to a file input element
   * @param selector The selector string or locator object for the file input
   * @param filePath Single file path (string) or array of file paths
   * @param timeout Optional timeout in milliseconds (default: 5000ms)
   */
  protected async uploadFile(selector: SelectorDefinition, filePath: string | string[], timeout: number = 5000): Promise<void> {
    const locator = await this.getLocator(selector);
    const files = Array.isArray(filePath) ? filePath : [filePath];
    this.logger.info(`Uploading file(s) to element: ${this.describeSelector(selector)}`);
    this.logger.info(`File(s) to upload: ${files.join(', ')}`);
    
    await locator.waitFor({ state: 'visible', timeout });
    await this.highlight(locator);
    try {
      if (Array.isArray(filePath)) {
        await locator.setInputFiles(filePath);
        this.logger.info(`Successfully uploaded ${filePath.length} file(s)`);
      } else {
        await locator.setInputFiles(filePath);
        this.logger.info(`Successfully uploaded file: ${filePath}`);
      }
      // optional small pause so the highlight is visible during the action
      if (this.page) await this.page.waitForTimeout(150);
    } catch (error) {
      this.logger.error(`Failed to upload file(s): ${files.join(', ')}`, error as Error);
      throw error;
    } finally {
      await this.unhighlight(locator);
    }
  }

  /**
   * Upload file(s) via button click that opens a file dialog
   * Use this method when clicking a button opens Windows file manager or file chooser dialog
   * @param buttonSelector The selector for the button that triggers the file dialog
   * @param filePath Single file path (string) or array of file paths
   * @param timeout Optional timeout in milliseconds for waiting file chooser (default: 10000ms)
   */
  protected async uploadFileViaButton(buttonSelector: SelectorDefinition, filePath: string | string[], timeout: number = 10000): Promise<void> {
    const buttonLocator = await this.getLocator(buttonSelector);
    const files = Array.isArray(filePath) ? filePath : [filePath];
    this.logger.info(`Clicking upload button: ${this.describeSelector(buttonSelector)}`);
    this.logger.info(`File(s) to upload: ${files.join(', ')}`);
    
    await buttonLocator.waitFor({ state: 'visible', timeout: 5000 });
    await this.highlight(buttonLocator);
    
    try {
      // Set up file chooser listener before clicking
      const fileChooserPromise = this.page.waitForEvent('filechooser', { timeout });
      
      // Click the button that opens the file dialog
      await buttonLocator.click();
      
      // Wait for file chooser dialog to appear
      const fileChooser: FileChooser = await fileChooserPromise;
      this.logger.info('File chooser dialog opened');
      
      // Set the files
      if (Array.isArray(filePath)) {
        await fileChooser.setFiles(filePath);
        this.logger.info(`Successfully uploaded ${filePath.length} file(s) via file chooser`);
      } else {
        await fileChooser.setFiles(filePath);
        this.logger.info(`Successfully uploaded file via file chooser: ${filePath}`);
      }
      
      // optional small pause
      if (this.page) await this.page.waitForTimeout(150);
    } catch (error) {
      this.logger.error(`Failed to upload file(s) via button: ${files.join(', ')}`, error as Error);
      await this.takeScreenshot('file-upload-failed');
      throw error;
    } finally {
      await this.unhighlight(buttonLocator);
    }
  }
  
  /**
   * Check if element is visible
   * @param selector The selector string or locator object
   * @returns True if element is visible
   */
  protected async isVisible(selector: SelectorDefinition): Promise<boolean> {
    const locator = await this.getLocator(selector);
    return await locator.isVisible();
  }
  
  /**
   * Get text from an element
   * @param selector The selector string or locator object
   * @returns Text content of the element
   */
  protected async getText(selector: SelectorDefinition): Promise<string> {
    const locator = await this.getLocator(selector);
    return await locator.textContent() || '';
  }
  
  /**
   * Wait for element to be visible
   * @param selector The selector string or locator object
   * @param timeout Optional timeout in milliseconds
   */
  protected async waitForVisible(selector: SelectorDefinition, timeout?: number): Promise<void> {
    const locator = await this.getLocator(selector);
    this.logger.info(`Waiting for element to be visible: ${this.describeSelector(selector)}`);
    try {
      await locator.waitFor({ state: 'visible', timeout });
      this.logger.info(`Element is now visible: ${this.describeSelector(selector)}`);
    } catch (error) {
      const message = `Element not visible within ${timeout ?? 30000}ms: ${this.describeSelector(selector)}`;
      this.logger.error(message, error as Error);
      
      // Take screenshot for debugging
      await this.takeScreenshot(`element-not-visible-${Date.now()}`);
      
      // Check if element exists in DOM
      const isAttached = await locator.count() > 0;
      this.logger.info(`Element exists in DOM: ${isAttached}`);
      
      if (isAttached) {
        const isVisible = await locator.isVisible();
        this.logger.info(`Element is visible: ${isVisible}`);
      }
      
      throw new Error(message);
    }
  }

  /**
   * Wait until element is present in DOM (attached)
   * @param selector The selector string or locator object
   * @param timeout Optional timeout in milliseconds
   */
  async waitUntilElementPresent(selector: SelectorDefinition, timeout?: number): Promise<void> {
    const locator = await this.getLocator(selector);
    this.logger.info(`Waiting until element is present: ${this.describeSelector(selector)}`);
    try {
      await locator.waitFor({ state: 'attached', timeout });
    } catch (error) {
      const message = `Element not present within ${timeout ?? 90000}ms: ${this.describeSelector(selector)}`;
      this.logger.error(message, error as Error);
      throw new Error(message);
    }
  }

  /**
   * Wait until element is clickable (visible and enabled)
   * @param selector The selector string or locator object
   * @param timeout Optional timeout in milliseconds
   */
  async waitUntilElementClickable(selector: SelectorDefinition, timeout?: number): Promise<void> {
    const locator = await this.getLocator(selector);
    this.logger.info(`Waiting until element is clickable: ${this.describeSelector(selector)}`);
    try {
      await locator.waitFor({ state: 'visible', timeout });
      await expect(locator).toBeEnabled({ timeout });
    } catch (error) {
      const message = `Element not clickable within ${timeout ?? 30000}ms: ${this.describeSelector(selector)}`;
      this.logger.error(message, error as Error);
      throw new Error(message);
    }
  }
  
  /**
   * Expect element to be visible
   * @param selector The selector string or locator object
   * @param message Optional assertion message
   */
  protected async expectVisible(selector: SelectorDefinition, message?: string): Promise<void> {
    const locator = await this.getLocator(selector);
    await expect(locator, message).toBeVisible();
  }
  
  /**
   * Select option from dropdown
   * @param selector The selector string or locator object
   * @param value The value to select
   */
  protected async selectOption(selector: SelectorDefinition, value: string): Promise<void> {
    const locator = await this.getLocator(selector);
    this.logger.info(`Selecting option: ${value} from dropdown: ${this.describeSelector(selector)}`);
    await locator.selectOption(value);
  }

  /**
   * Get iframe frame object by selector, name, or URL
   * @param iframeSelector Selector for the iframe element, or frame name, or URL pattern
   * @param timeout Optional timeout in milliseconds (default: 10000ms)
   * @returns Frame object
   */
  protected async getFrame(iframeSelector: string | { name?: string; url?: string | RegExp }, timeout: number = 10000): Promise<Frame> {
    this.logger.info(`Getting iframe: ${typeof iframeSelector === 'string' ? iframeSelector : JSON.stringify(iframeSelector)}`);
    
    let frame: Frame | null = null;
    
    try {
      if (typeof iframeSelector === 'string') {
        // If it's a string, treat it as a selector
        const iframeLocator = this.page.locator(iframeSelector);
        await iframeLocator.waitFor({ state: 'attached', timeout });
        const iframeElement = await iframeLocator.elementHandle();
        if (iframeElement) {
          frame = await iframeElement.contentFrame();
        }
      } else {
        // If it's an object, use name or URL
        if (iframeSelector.name) {
          frame = this.page.frame({ name: iframeSelector.name });
        } else if (iframeSelector.url) {
          frame = this.page.frame({ url: iframeSelector.url });
        }
      }
      
      if (!frame) {
        throw new Error(`Iframe not found: ${typeof iframeSelector === 'string' ? iframeSelector : JSON.stringify(iframeSelector)}`);
      }
      
      this.logger.info('Iframe found successfully');
      return frame;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to get iframe: ${errorMessage}`);
      throw new Error(`Failed to get iframe: ${errorMessage}`);
    }
  }

  /**
   * Click on an element inside an iframe
   * @param iframeSelector Selector for the iframe element, or frame name, or URL pattern
   * @param elementSelector Selector for the element inside the iframe
   * @param timeout Optional timeout in milliseconds (default: 5000ms)
   */
  protected async clickInFrame(iframeSelector: string | { name?: string; url?: string | RegExp }, elementSelector: string, timeout: number = 5000): Promise<void> {
    this.logger.info(`Clicking element in iframe: ${elementSelector}`);
    
    try {
      const frame = await this.getFrame(iframeSelector, timeout);
      const elementLocator = frame.locator(elementSelector);
      
      await elementLocator.waitFor({ state: 'visible', timeout });
      await elementLocator.click();
      
      this.logger.info(`Successfully clicked element in iframe: ${elementSelector}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to click element in iframe: ${errorMessage}`);
      await this.takeScreenshot('iframe-click-failed');
      throw new Error(`Failed to click element in iframe: ${errorMessage}`);
    }
  }

  /**
   * Fill an input field inside an iframe
   * @param iframeSelector Selector for the iframe element, or frame name, or URL pattern
   * @param elementSelector Selector for the input element inside the iframe
   * @param value The value to fill
   * @param timeout Optional timeout in milliseconds (default: 5000ms)
   */
  protected async fillInFrame(iframeSelector: string | { name?: string; url?: string | RegExp }, elementSelector: string, value: string, timeout: number = 5000): Promise<void> {
    this.logger.info(`Filling element in iframe: ${elementSelector} with value: ${value}`);
    
    try {
      const frame = await this.getFrame(iframeSelector, timeout);
      const elementLocator = frame.locator(elementSelector);
      
      await elementLocator.waitFor({ state: 'visible', timeout });
      await elementLocator.fill(value);
      
      this.logger.info(`Successfully filled element in iframe: ${elementSelector}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to fill element in iframe: ${errorMessage}`);
      await this.takeScreenshot('iframe-fill-failed');
      throw new Error(`Failed to fill element in iframe: ${errorMessage}`);
    }
  }

  /**
   * Wait for element to be visible inside an iframe
   * @param iframeSelector Selector for the iframe element, or frame name, or URL pattern
   * @param elementSelector Selector for the element inside the iframe
   * @param timeout Optional timeout in milliseconds (default: 5000ms)
   */
  protected async waitForVisibleInFrame(iframeSelector: string | { name?: string; url?: string | RegExp }, elementSelector: string, timeout: number = 5000): Promise<void> {
    this.logger.info(`Waiting for element to be visible in iframe: ${elementSelector}`);
    
    try {
      const frame = await this.getFrame(iframeSelector, timeout);
      const elementLocator = frame.locator(elementSelector);
      
      await elementLocator.waitFor({ state: 'visible', timeout });
      this.logger.info(`Element is now visible in iframe: ${elementSelector}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Element not visible in iframe: ${errorMessage}`);
      await this.takeScreenshot('iframe-element-not-visible');
      throw new Error(`Element not visible in iframe: ${errorMessage}`);
    }
  }

  /**
   * Upload file(s) via button click inside an iframe that opens a file dialog
   * Use this method when clicking a button inside an iframe opens Windows file manager or file chooser dialog
   * @param iframeSelector Selector for the iframe element, or frame name, or URL pattern
   * @param buttonSelector Selector for the button inside the iframe that triggers the file dialog
   * @param filePath Single file path (string) or array of file paths
   * @param timeout Optional timeout in milliseconds for waiting file chooser (default: 10000ms)
   */
  protected async uploadFileViaButtonInFrame(iframeSelector: string | { name?: string; url?: string | RegExp }, buttonSelector: string, filePath: string | string[], timeout: number = 10000): Promise<void> {
    const files = Array.isArray(filePath) ? filePath : [filePath];
    this.logger.info(`Uploading file(s) via button click inside iframe`);
    this.logger.info(`Iframe: ${typeof iframeSelector === 'string' ? iframeSelector : JSON.stringify(iframeSelector)}`);
    this.logger.info(`Button: ${buttonSelector}`);
    this.logger.info(`File(s) to upload: ${files.join(', ')}`);
    
    try {
      // Get the iframe frame object
      const frame = await this.getFrame(iframeSelector, timeout);
      
      // Get the button locator inside the iframe
      const buttonLocator = frame.locator(buttonSelector);
      
      // Wait for button to be visible
      await buttonLocator.waitFor({ state: 'visible', timeout: 5000 });
      this.logger.info('Upload button found inside iframe');
      
      // Set up file chooser listener before clicking
      // Note: File chooser events are always on the main page, not the frame
      const fileChooserPromise = this.page.waitForEvent('filechooser', { timeout });
      
      // Click the button inside the iframe that opens the file dialog
      await buttonLocator.click();
      this.logger.info('Upload button clicked inside iframe');
      
      // Wait for file chooser dialog to appear
      const fileChooser: FileChooser = await fileChooserPromise;
      this.logger.info('File chooser dialog opened');
      
      // Set the files
      if (Array.isArray(filePath)) {
        await fileChooser.setFiles(filePath);
        this.logger.info(`Successfully uploaded ${filePath.length} file(s) via file chooser from iframe`);
      } else {
        await fileChooser.setFiles(filePath);
        this.logger.info(`Successfully uploaded file via file chooser from iframe: ${filePath}`);
      }
      
      // Optional small pause
      if (this.page) await this.page.waitForTimeout(150);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to upload file(s) via button in iframe: ${files.join(', ')}`, error as Error);
      await this.takeScreenshot('iframe-file-upload-failed');
      throw new Error(`Failed to upload file(s) via button in iframe: ${errorMessage}`);
    }
  }

  /**
   * Navigate to the page URL
   */
  async navigate(): Promise<void> {
    if (!this.url) {
      throw new Error(`URL not defined for ${this.constructor.name}`);
    }
    this.logger.info(`Navigating to: ${this.url}`);
    
    // Use longer timeout for CI environments
    const navigationTimeout = process.env.CI ? 120000 : 60000;
    
    try {
      await this.page.goto(this.url, { 
        waitUntil: 'domcontentloaded',
        timeout: navigationTimeout 
      });
      
      await this.waitForPageLoad();
    } catch (error) {
      this.logger.error(`Navigation failed to ${this.url}`, error as Error);
      
      // Take screenshot for debugging
      try {
        await this.takeScreenshot('navigation-error');
      } catch (screenshotError) {
        this.logger.warn('Could not take screenshot', screenshotError as Error);
      }
      
      throw error;
    }
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    // Wait for DOM content to be loaded first
    await this.page.waitForLoadState('domcontentloaded');
    this.logger.info('DOM content loaded');
    
    // Try to wait for network idle, but don't fail if it times out
    const networkIdleTimeout = process.env.CI ? 30000 : 10000;
    try {
      await this.page.waitForLoadState('networkidle', { timeout: networkIdleTimeout });
      this.logger.info('Network idle - page loaded successfully');
    } catch (error) {
      // Network idle timeout is expected for pages with continuous network activity
      this.logger.info('Network idle timeout (expected for pages with continuous activity). DOM is ready.');
    }
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
   * Maximize the browser window/viewport
   * @param width Optional width in pixels (default: 1920)
   * @param height Optional height in pixels (default: 1080)
   */
  async maximizeScreen(width: number = 1920, height: number = 1080): Promise<void> {
    this.logger.info(`Maximizing screen to ${width}x${height}`);
    await this.page.setViewportSize({ width, height });
    this.logger.info(`Screen maximized to ${width}x${height}`);
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
    // Wait for DOM to be ready instead of networkidle (more reliable)
    await this.page.waitForLoadState('domcontentloaded');
    this.logger.info('Navigation complete - DOM ready');
  }

  /**
   * Wait for a specified timeout (static wait - cannot be interrupted)
   */
  async waitForTimeout(timeout: number): Promise<void> {
    this.logger.info(`Waiting for ${timeout}ms`);
    return new Promise(resolve => setTimeout(resolve, timeout));
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
  async getTextAndCompare(selector: SelectorDefinition, expectedText: string, exactMatch: boolean = true): Promise<boolean> {
    const actualText = await this.getText(selector);
    this.logger.info(`Comparing text for element: ${this.describeSelector(selector)}`);
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
  async verifyText(selector: SelectorDefinition, expectedText: string, exactMatch: boolean = true): Promise<void> {
    const locator = await this.getLocator(selector);
    const actualText = await this.getText(selector);
    
    this.logger.info(`Verifying text for element: ${this.describeSelector(selector)}`);
    this.logger.info(`Expected: "${expectedText}"`);
    this.logger.info(`Actual: "${actualText}"`);
    
    if (exactMatch) {
      expect(actualText).toBe(expectedText);
    } else {
      expect(actualText).toContain(expectedText);
    }
    
    this.logger.info(`Text verification passed`);
  }

  private describeSelector(selector: SelectorDefinition): string {
    if (Array.isArray(selector)) {
      return selector.map(item => this.describeSelector(item)).join(' | ');
    }
    if (typeof selector === 'string') {
      return selector;
    }
    try {
      return selector.toString();
    } catch {
      return '[Locator]';
    }
  }

  private async resolveAutoHealingSelector(selectors: Array<string | Locator>): Promise<Locator> {
    const failureMessages: string[] = [];

    let fallbackLocator: Locator | null = null;

    for (const candidate of selectors) {
      const locator = typeof candidate === 'string' ? this.page.locator(candidate) : candidate;
      try {
        const count = await locator.count();
        if (count === 0) {
          failureMessages.push(`No elements found for selector: ${this.describeSelector(candidate)}`);
          if (!fallbackLocator) {
            fallbackLocator = locator;
          }
          continue;
        }

        const first = locator.first();
        let isVisible = false;
        try {
          isVisible = await first.isVisible();
        } catch {
          isVisible = false;
        }

        if (isVisible) {
          this.logger.info(`Auto-healing matched selector (visible): ${this.describeSelector(candidate)}`);
        } else {
          this.logger.info(`Auto-healing matched selector (not yet visible): ${this.describeSelector(candidate)}`);
        }
        return locator;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        failureMessages.push(`Error using selector ${this.describeSelector(candidate)}: ${message}`);
      }
    }

    if (fallbackLocator) {
      const fallbackDescription = this.describeSelector(fallbackLocator);
      this.logger.warn(
        `Auto-healing falling back to first matching selector without initial elements: ${fallbackDescription}`
      );
      return fallbackLocator;
    }

    const errorMessage = `Auto-healing failed. Tried selectors: ${failureMessages.join(' | ')}`;
    this.logger.error(errorMessage);
    throw new Error(errorMessage);
  }
}