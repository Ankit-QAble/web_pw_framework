import { Page, Locator, expect, TestInfo, FileChooser, Frame } from '@playwright/test';
import { Logger } from '../utils/Logger';
import { ScreenshotHelper } from '../utils/ScreenshotHelper';
import * as fs from 'fs';
import * as path from 'path';

type SelectorDefinition = string | Locator | Array<string | Locator>;

export interface ConsoleLogEntry {
  type: 'log' | 'debug' | 'info' | 'warning' | 'error';
  text: string;
  timestamp: Date;
  location?: {
    url?: string;
    lineNumber?: number;
    columnNumber?: number;
  };
}

export interface NetworkRequestEntry {
  url: string;
  method: string;
  status?: number;
  statusText?: string;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  requestBody?: string | object;
  responseBody?: string | object;
  timestamp: Date;
  duration?: number;
  resourceType?: string;
}

type PageAriaRole = Parameters<Page['getByRole']>[0];

export abstract class BasePage {
  protected page: Page;
  protected logger: Logger;
  protected url?: string;
  protected screenshotHelper?: ScreenshotHelper;
  private consoleLogs: ConsoleLogEntry[] = [];
  private networkRequests: NetworkRequestEntry[] = [];
  private isCapturingConsole: boolean = false;
  private isCapturingNetwork: boolean = false;

  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    this.page = page;
    this.url = url;
    this.logger = new Logger(this.constructor.name);
    if (testInfo) {
      this.screenshotHelper = new ScreenshotHelper(page, testInfo);
    }
  }
  
  /**
   * Convenience wrappers around Playwright's built‑in locators so they can be
   * used seamlessly with the framework helpers that accept `Locator`.
   *
   * Example:
   *   await this.click(this.byRole('button', { name: 'Login' }));
   */

  /** Wrapper for page.getByRole(...) */
  protected byRole(
    role: PageAriaRole,
    options?: Parameters<Page['getByRole']>[1]
  ): Locator {
    return this.page.getByRole(role, options as any);
  }

  /** Wrapper for page.getByText(...) */
  protected byText(
    text: string | RegExp,
    options?: Parameters<Page['getByText']>[1]
  ): Locator {
    return this.page.getByText(text, options as any);
  }

  /** Wrapper for page.getByLabel(...) */
  protected byLabel(
    text: string | RegExp,
    options?: Parameters<Page['getByLabel']>[1]
  ): Locator {
    return this.page.getByLabel(text, options as any);
  }

  /** Wrapper for page.getByPlaceholder(...) */
  protected byPlaceholder(
    text: string | RegExp,
    options?: Parameters<Page['getByPlaceholder']>[1]
  ): Locator {
    return this.page.getByPlaceholder(text, options as any);
  }

  /** Wrapper for page.getByAltText(...) */
  protected byAltText(
    text: string | RegExp,
    options?: Parameters<Page['getByAltText']>[1]
  ): Locator {
    return this.page.getByAltText(text, options as any);
  }

  /** Wrapper for page.getByTitle(...) */
  protected byTitle(
    text: string | RegExp,
    options?: Parameters<Page['getByTitle']>[1]
  ): Locator {
    return this.page.getByTitle(text, options as any);
  }

  /** Wrapper for page.getByTestId(...) */
  protected byTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  /** Generic wrapper for page.locator(cssOrOtherSelector) */
  protected locator(
    selector: Parameters<Page['locator']>[0],
    options?: Parameters<Page['locator']>[1]
  ): Locator {
    return this.page.locator(selector as any, options as any);
  }

  /**
   * Convenience helper for XPath selectors, equivalent to:
   *   page.locator(`xpath=${xpathExpression}`)
   */
  protected locatorXPath(xpathExpression: string, options?: Parameters<Page['locator']>[1]): Locator {
    return this.page.locator(`xpath=${xpathExpression}`, options as any);
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
  async takeScreenshot(name?: string, timeout = 10): Promise<string> {
    if (this.screenshotHelper) {
      // Use ScreenshotHelper for proper file saving and test attachment
      return await this.screenshotHelper.takeScreenshot(name);
    } else {
      // Fallback to basic screenshot without file saving
      const screenshotName = name || `screenshot-${Date.now()}`;
      this.logger.info(`Taking screenshot: ${screenshotName}`);
      await this.page.screenshot({ fullPage: true });
      this.logger.warn('Screenshot taken but not saved to file (no TestInfo provided)');
      return `Screenshot taken: ${screenshotName}`;
    }
  }

  /**
   * Perform a visual comparison against a stored baseline image.
   * On first run (no baseline), the current screenshot becomes the baseline and the check passes.
   *
   * @param name Logical name of the screenshot (e.g. 'google-home')
   * @param threshold Allowed difference (default 1% of pixels)
   * @param thresholdType 'percent' (0–1) or absolute 'pixel' count
   */
  async compareScreenshot(
    name: string,
    threshold: number = 0.01,
    thresholdType: 'percent' | 'pixel' = 'percent'
  ): Promise<void> {
    if (!this.screenshotHelper) {
      this.logger.warn('ScreenshotHelper not initialized; visual comparison skipped');
      return;
    }

    const result = await this.screenshotHelper.compareWithBaseline(name, {
      threshold,
      thresholdType,
    });

    // If baseline was just created, diffPixels will be zero and passed=true
    this.logger.info(
      `Visual compare for "${name}" – diffPixels: ${result.diffPixels}, diffRatio: ${
        result.diffRatio * 100
      }%, passed: ${result.passed}`
    );

    expect(
      result.passed,
      `Visual comparison failed for "${name}". See baseline: ${result.baselinePath}, actual: ${result.actualPath}, diff: ${result.diffPath}`
    ).toBe(true);
  }

  /**
   * Perform a visual comparison for a specific element/locator against a baseline image.
   */
  async compareElementScreenshot(
    selector: SelectorDefinition,
    name: string,
    threshold: number = 0.01,
    thresholdType: 'percent' | 'pixel' = 'percent'
  ): Promise<void> {
    if (!this.screenshotHelper) {
      this.logger.warn('ScreenshotHelper not initialized; element visual comparison skipped');
      return;
    }

    const locator = await this.getLocator(selector);
    const result = await this.screenshotHelper.compareElementWithBaseline(locator, name, {
      threshold,
      thresholdType,
    });

    this.logger.info(
      `Element visual compare for "${name}" – diffPixels: ${result.diffPixels}, diffRatio: ${
        result.diffRatio * 100
      }%, passed: ${result.passed}`
    );

    expect(
      result.passed,
      `Element visual comparison failed for "${name}". See baseline: ${result.baselinePath}, actual: ${result.actualPath}, diff: ${result.diffPath}`
    ).toBe(true);
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
  async verifyTitle(expectedTitle: string, softAssert: boolean = false): Promise<void> {
    const actualTitle = await this.getTitle();
    if (softAssert) {
      expect.soft(actualTitle).toBe(expectedTitle);
    } else {
      expect(actualTitle).toBe(expectedTitle);
    }
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
   * @param softAssert Whether to perform a soft assertion (default: false)
   * @returns True if text matches, false otherwise
   */
  async getTextAndCompare(selector: SelectorDefinition, expectedText: string, exactMatch: boolean = true, softAssert: boolean = false): Promise<boolean> {
    if (expectedText === undefined || expectedText === null) {
      const msg = `Expected text is undefined or null for selector: ${this.describeSelector(selector)}`;
      this.logger.error(msg);
      if (softAssert) {
         expect.soft(expectedText as any, msg).toBeDefined();
         return false;
      }
      throw new Error(msg);
    }

    let actualText = '';
    try {
      actualText = await this.getText(selector);
    } catch (error) {
      if (softAssert) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        // Using null as actual value to indicate failure to retrieve text
        // This will fail the soft assertion
        expect.soft(null, `Failed to get text from element: ${this.describeSelector(selector)}. Error: ${errorMessage}`).toBe(expectedText);
        this.logger.error(`Soft assertion failed: Could not get text from element. ${errorMessage}`);
        return false;
      }
      throw error;
    }
    
    // Normalize text by removing zero-width spaces and other invisible characters if needed
    // This helps with CMS content that often contains artifacts
    const normalizedActual = actualText.replace(/[\u200B-\u200D\uFEFF]/g, '');
    const normalizedExpected = expectedText.replace(/[\u200B-\u200D\uFEFF]/g, '');

    this.logger.info(`Comparing text for element: ${this.describeSelector(selector)}`);
    this.logger.info(`Expected: "${normalizedExpected}"`);
    this.logger.info(`Actual: "${normalizedActual}"`);
    
    let isMatch: boolean;
    if (exactMatch) {
      isMatch = normalizedActual === normalizedExpected;
    } else {
      isMatch = normalizedActual.includes(normalizedExpected);
    }
    
    if (softAssert) {
      if (exactMatch) {
        expect.soft(normalizedActual, `Text mismatch! Expected: "${normalizedExpected}", Actual: "${normalizedActual}"`).toBe(normalizedExpected);
      } else {
        expect.soft(normalizedActual, `Text mismatch! Expected "${normalizedActual}" to contain "${normalizedExpected}"`).toContain(normalizedExpected);
      }
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

  /**
   * Navigate to a specific URL
   */
  async navigateTo(url: string): Promise<void> {
    this.logger.info(`Navigating to: ${url}`);
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Wait for specified time (alias for waitForTimeout)
   */
  async wait(milliseconds: number): Promise<void> {
    await this.waitForTimeout(milliseconds);
  }

  /**
   * Clear browser data (cookies, permissions, etc.)
   */
  async clearBrowserData(): Promise<void> {
    this.logger.info('Clearing browser data');
    const context = this.page.context();
    await context.clearCookies();
    await context.clearPermissions();
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
  async executeScript<T>(
    script: string | ((...args: any[]) => T),
    ...args: any[]
  ): Promise<T> {
    const scriptDescription =
      typeof script === 'string' ? script : script.name || 'anonymous function';

    this.logger.info(`Executing script: ${scriptDescription}`);

    if (typeof script === 'string') {
      const trimmedScript = script.trim();
      if (!trimmedScript) {
        throw new Error('Script cannot be empty');
      }

      const withoutReturn = trimmedScript.startsWith('return ')
        ? trimmedScript.replace(/^return\s+/, '')
        : trimmedScript;

      const expression = withoutReturn.replace(/;+\s*$/, '');

      // Evaluate arbitrary expression within browser context
      // eslint-disable-next-line no-new-func
      return await this.page.evaluate(
        (expr) => new Function(`return (${expr});`)(),
        expression
      );
    }

    return await this.page.evaluate(script as (...innerArgs: any[]) => T, ...args);
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

  // ==================== KEYBOARD METHODS ====================

  /**
   * Press Enter key
   */
  async pressEnter(): Promise<void> {
    this.logger.info('Pressing Enter key');
    await this.page.keyboard.press('Enter');
  }

  /**
   * Press Tab key
   */
  async pressTab(): Promise<void> {
    this.logger.info('Pressing Tab key');
    await this.page.keyboard.press('Tab');
  }

  /**
   * Press Escape key
   */
  async pressEscape(): Promise<void> {
    this.logger.info('Pressing Escape key');
    await this.page.keyboard.press('Escape');
  }

  /**
   * Press Space key
   */
  async pressSpace(): Promise<void> {
    this.logger.info('Pressing Space key');
    await this.page.keyboard.press('Space');
  }

  /**
   * Press Backspace key
   */
  async pressBackspace(): Promise<void> {
    this.logger.info('Pressing Backspace key');
    await this.page.keyboard.press('Backspace');
  }

  /**
   * Press Delete key
   */
  async pressDelete(): Promise<void> {
    this.logger.info('Pressing Delete key');
    await this.page.keyboard.press('Delete');
  }

  /**
   * Press Arrow keys
   */
  async pressArrowUp(): Promise<void> {
    this.logger.info('Pressing Arrow Up key');
    await this.page.keyboard.press('ArrowUp');
  }

  async pressArrowDown(): Promise<void> {
    this.logger.info('Pressing Arrow Down key');
    await this.page.keyboard.press('ArrowDown');
  }

  async pressArrowLeft(): Promise<void> {
    this.logger.info('Pressing Arrow Left key');
    await this.page.keyboard.press('ArrowLeft');
  }

  async pressArrowRight(): Promise<void> {
    this.logger.info('Pressing Arrow Right key');
    await this.page.keyboard.press('ArrowRight');
  }

  /**
   * Press Home key
   */
  async pressHome(): Promise<void> {
    this.logger.info('Pressing Home key');
    await this.page.keyboard.press('Home');
  }

  /**
   * Press End key
   */
  async pressEnd(): Promise<void> {
    this.logger.info('Pressing End key');
    await this.page.keyboard.press('End');
  }

  /**
   * Press Page Up key
   */
  async pressPageUp(): Promise<void> {
    this.logger.info('Pressing Page Up key');
    await this.page.keyboard.press('PageUp');
  }

  /**
   * Press Page Down key
   */
  async pressPageDown(): Promise<void> {
    this.logger.info('Pressing Page Down key');
    await this.page.keyboard.press('PageDown');
  }

  /**
   * Press F1-F12 function keys
   */
  async pressF1(): Promise<void> {
    this.logger.info('Pressing F1 key');
    await this.page.keyboard.press('F1');
  }

  async pressF2(): Promise<void> {
    this.logger.info('Pressing F2 key');
    await this.page.keyboard.press('F2');
  }

  async pressF3(): Promise<void> {
    this.logger.info('Pressing F3 key');
    await this.page.keyboard.press('F3');
  }

  async pressF4(): Promise<void> {
    this.logger.info('Pressing F4 key');
    await this.page.keyboard.press('F4');
  }

  async pressF5(): Promise<void> {
    this.logger.info('Pressing F5 key');
    await this.page.keyboard.press('F5');
  }

  async pressF6(): Promise<void> {
    this.logger.info('Pressing F6 key');
    await this.page.keyboard.press('F6');
  }

  async pressF7(): Promise<void> {
    this.logger.info('Pressing F7 key');
    await this.page.keyboard.press('F7');
  }

  async pressF8(): Promise<void> {
    this.logger.info('Pressing F8 key');
    await this.page.keyboard.press('F8');
  }

  async pressF9(): Promise<void> {
    this.logger.info('Pressing F9 key');
    await this.page.keyboard.press('F9');
  }

  async pressF10(): Promise<void> {
    this.logger.info('Pressing F10 key');
    await this.page.keyboard.press('F10');
  }

  async pressF11(): Promise<void> {
    this.logger.info('Pressing F11 key');
    await this.page.keyboard.press('F11');
  }

  async pressF12(): Promise<void> {
    this.logger.info('Pressing F12 key');
    await this.page.keyboard.press('F12');
  }

  /**
   * Press Ctrl+A (Select All)
   */
  async pressCtrlA(): Promise<void> {
    this.logger.info('Pressing Ctrl+A (Select All)');
    await this.page.keyboard.press('Control+a');
  }

  /**
   * Press Ctrl+C (Copy)
   */
  async pressCtrlC(): Promise<void> {
    this.logger.info('Pressing Ctrl+C (Copy)');
    await this.page.keyboard.press('Control+c');
  }

  /**
   * Press Ctrl+V (Paste)
   */
  async pressCtrlV(): Promise<void> {
    this.logger.info('Pressing Ctrl+V (Paste)');
    await this.page.keyboard.press('Control+v');
  }

  /**
   * Press Ctrl+X (Cut)
   */
  async pressCtrlX(): Promise<void> {
    this.logger.info('Pressing Ctrl+X (Cut)');
    await this.page.keyboard.press('Control+x');
  }

  /**
   * Press Ctrl+Z (Undo)
   */
  async pressCtrlZ(): Promise<void> {
    this.logger.info('Pressing Ctrl+Z (Undo)');
    await this.page.keyboard.press('Control+z');
  }

  /**
   * Press Ctrl+Y (Redo)
   */
  async pressCtrlY(): Promise<void> {
    this.logger.info('Pressing Ctrl+Y (Redo)');
    await this.page.keyboard.press('Control+y');
  }

  /**
   * Press Ctrl+S (Save)
   */
  async pressCtrlS(): Promise<void> {
    this.logger.info('Pressing Ctrl+S (Save)');
    await this.page.keyboard.press('Control+s');
  }

  /**
   * Press Ctrl+F (Find)
   */
  async pressCtrlF(): Promise<void> {
    this.logger.info('Pressing Ctrl+F (Find)');
    await this.page.keyboard.press('Control+f');
  }

  /**
   * Press Alt+Tab (Switch applications)
   */
  async pressAltTab(): Promise<void> {
    this.logger.info('Pressing Alt+Tab (Switch applications)');
    await this.page.keyboard.press('Alt+Tab');
  }

  /**
   * Press any key by name
   */
  async pressKey(key: string): Promise<void> {
    this.logger.info(`Pressing key: ${key}`);
    await this.page.keyboard.press(key);
  }

  /**
   * Type text with optional delay between keystrokes
   */
  async typeText(text: string, delay?: number): Promise<void> {
    this.logger.info(`Typing text: ${text}`);
    if (delay) {
      await this.page.keyboard.type(text, { delay });
    } else {
      await this.page.keyboard.type(text);
    }
  }

  /**
   * Type text slowly (with 100ms delay between keystrokes)
   */
  async typeTextSlowly(text: string): Promise<void> {
    this.logger.info(`Typing text slowly: ${text}`);
    await this.page.keyboard.type(text, { delay: 100 });
  }

  /**
   * Type text very slowly (with 200ms delay between keystrokes)
   */
  async typeTextVerySlowly(text: string): Promise<void> {
    this.logger.info(`Typing text very slowly: ${text}`);
    await this.page.keyboard.type(text, { delay: 200 });
  }

  /**
   * Press multiple keys in sequence
   */
  async pressKeys(keys: string[]): Promise<void> {
    this.logger.info(`Pressing keys in sequence: ${keys.join(', ')}`);
    for (const key of keys) {
      await this.page.keyboard.press(key);
    }
  }

  /**
   * Press key combination (e.g., 'Control+Shift+A')
   */
  async pressKeyCombination(combination: string): Promise<void> {
    this.logger.info(`Pressing key combination: ${combination}`);
    await this.page.keyboard.press(combination);
  }

  /**
   * Hold down a key
   */
  async holdKey(key: string): Promise<void> {
    this.logger.info(`Holding down key: ${key}`);
    await this.page.keyboard.down(key);
  }

  /**
   * Release a key
   */
  async releaseKey(key: string): Promise<void> {
    this.logger.info(`Releasing key: ${key}`);
    await this.page.keyboard.up(key);
  }

  /**
   * Insert text at cursor position
   */
  async insertText(text: string): Promise<void> {
    this.logger.info(`Inserting text: ${text}`);
    await this.page.keyboard.insertText(text);
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

  /**
   * Start capturing console logs from the browser
   * @param logLevels Optional array of log levels to capture (default: all levels)
   * @returns Promise that resolves when capturing is started
   */
  async captureConsoleLogs(logLevels: Array<'log' | 'debug' | 'info' | 'warning' | 'error'> = ['log', 'debug', 'info', 'warning', 'error']): Promise<void> {
    if (this.isCapturingConsole) {
      this.logger.warn('Console log capturing is already active');
      return;
    }

    this.consoleLogs = [];
    this.isCapturingConsole = true;

    this.page.on('console', (msg) => {
      const type = msg.type() as 'log' | 'debug' | 'info' | 'warning' | 'error';
      
      if (logLevels.includes(type)) {
        const text = msg.text();
        const location = msg.location();
        
        const logEntry: ConsoleLogEntry = {
          type,
          text,
          timestamp: new Date(),
          location: {
            url: location.url,
            lineNumber: location.lineNumber,
            columnNumber: location.columnNumber
          }
        };

        this.consoleLogs.push(logEntry);

        // Log to framework logger based on console type
        const logMessage = `[Browser Console ${type.toUpperCase()}] ${text}${location.url ? ` (${location.url}:${location.lineNumber})` : ''}`;
        
        switch (type) {
          case 'error':
            this.logger.error(logMessage);
            break;
          case 'warning':
            this.logger.warn(logMessage);
            break;
          case 'info':
          case 'debug':
            this.logger.debug(logMessage);
            break;
          default:
            this.logger.info(logMessage);
        }
      }
    });

    this.logger.info(`Started capturing console logs (levels: ${logLevels.join(', ')})`);
  }

  /**
   * Stop capturing console logs
   */
  stopCapturingConsoleLogs(): void {
    if (!this.isCapturingConsole) {
      this.logger.warn('Console log capturing is not active');
      return;
    }

    this.isCapturingConsole = false;
    this.logger.info('Stopped capturing console logs');
  }

  /**
   * Get all captured console logs
   * @param filterByType Optional filter by log type
   * @returns Array of console log entries
   */
  getConsoleLogs(filterByType?: 'log' | 'debug' | 'info' | 'warning' | 'error'): ConsoleLogEntry[] {
    if (filterByType) {
      return this.consoleLogs.filter(log => log.type === filterByType);
    }
    return [...this.consoleLogs];
  }

  /**
   * Get console errors only
   * @returns Array of error console log entries
   */
  getConsoleErrors(): ConsoleLogEntry[] {
    return this.getConsoleLogs('error');
  }

  /**
   * Get console warnings only
   * @returns Array of warning console log entries
   */
  getConsoleWarnings(): ConsoleLogEntry[] {
    return this.getConsoleLogs('warning');
  }

  /**
   * Clear captured console logs
   */
  clearConsoleLogs(): void {
    this.consoleLogs = [];
    this.logger.info('Cleared captured console logs');
  }

  /**
   * Start capturing network requests and responses
   * @param filterByUrl Optional URL pattern to filter requests (regex or string)
   * @param filterByMethod Optional HTTP method to filter requests
   * @returns Promise that resolves when capturing is started
   */
  async captureNetworkRequests(filterByUrl?: string | RegExp, filterByMethod?: string): Promise<void> {
    if (this.isCapturingNetwork) {
      this.logger.warn('Network request capturing is already active');
      return;
    }

    this.networkRequests = [];
    this.isCapturingNetwork = true;

    this.page.on('request', async (request) => {
      const url = request.url();
      const method = request.method();

      // Apply filters if provided
      if (filterByUrl) {
        const urlPattern = typeof filterByUrl === 'string' ? new RegExp(filterByUrl) : filterByUrl;
        if (!urlPattern.test(url)) {
          return;
        }
      }

      if (filterByMethod && method.toUpperCase() !== filterByMethod.toUpperCase()) {
        return;
      }

      const requestHeaders = request.headers();
      let requestBody: string | object | undefined;

      try {
        const postData = request.postData();
        if (postData) {
          try {
            requestBody = JSON.parse(postData);
          } catch {
            requestBody = postData;
          }
        }
      } catch {
        // Ignore errors when reading request body
      }

      const requestEntry: NetworkRequestEntry = {
        url,
        method,
        requestHeaders,
        requestBody,
        timestamp: new Date(),
        resourceType: request.resourceType()
      };

      this.networkRequests.push(requestEntry);
      this.logger.debug(`[Network Request] ${method} ${url}`);
    });

    this.page.on('response', async (response) => {
      const url = response.url();
      const method = response.request().method();
      const status = response.status();
      const statusText = response.statusText();

      // Find matching request entry
      const requestEntry = this.networkRequests.find(req => req.url === url && req.method === method);
      
      if (requestEntry) {
        const startTime = requestEntry.timestamp.getTime();
        const endTime = Date.now();
        requestEntry.duration = endTime - startTime;
        requestEntry.status = status;
        requestEntry.statusText = statusText;
        requestEntry.responseHeaders = response.headers();

        // Try to get response body for non-binary content
        try {
          const contentType = response.headers()['content-type'] || '';
          if (contentType.includes('application/json')) {
            requestEntry.responseBody = await response.json();
          } else if (contentType.includes('text/')) {
            requestEntry.responseBody = await response.text();
          }
        } catch {
          // Ignore errors when reading response body (may be binary or too large)
        }

        // Log response
        const statusEmoji = status >= 200 && status < 300 ? '✅' : status >= 400 ? '❌' : '⚠️';
        this.logger.info(`[Network Response] ${statusEmoji} ${method} ${url} - ${status} ${statusText} (${requestEntry.duration}ms)`);
      }
    });

    const filterInfo = [];
    if (filterByUrl) filterInfo.push(`URL: ${filterByUrl}`);
    if (filterByMethod) filterInfo.push(`Method: ${filterByMethod}`);
    
    this.logger.info(`Started capturing network requests${filterInfo.length > 0 ? ` (${filterInfo.join(', ')})` : ''}`);
  }

  /**
   * Stop capturing network requests
   */
  stopCapturingNetworkRequests(): void {
    if (!this.isCapturingNetwork) {
      this.logger.warn('Network request capturing is not active');
      return;
    }

    this.isCapturingNetwork = false;
    this.logger.info('Stopped capturing network requests');
  }

  /**
   * Get all captured network requests
   * @param filterByStatus Optional filter by HTTP status code
   * @param filterByMethod Optional filter by HTTP method
   * @returns Array of network request entries
   */
  getNetworkRequests(filterByStatus?: number, filterByMethod?: string): NetworkRequestEntry[] {
    let filtered = [...this.networkRequests];

    if (filterByStatus !== undefined) {
      filtered = filtered.filter(req => req.status === filterByStatus);
    }

    if (filterByMethod) {
      filtered = filtered.filter(req => req.method.toUpperCase() === filterByMethod.toUpperCase());
    }

    return filtered;
  }

  /**
   * Get failed network requests (status >= 400)
   * @returns Array of failed network request entries
   */
  getFailedNetworkRequests(): NetworkRequestEntry[] {
    return this.networkRequests.filter(req => req.status !== undefined && req.status >= 400);
  }

  /**
   * Get successful network requests (status 200-299)
   * @returns Array of successful network request entries
   */
  getSuccessfulNetworkRequests(): NetworkRequestEntry[] {
    return this.networkRequests.filter(req => req.status !== undefined && req.status >= 200 && req.status < 300);
  }

  /**
   * Get network requests by URL pattern
   * @param urlPattern URL pattern to match (regex or string)
   * @returns Array of matching network request entries
   */
  getNetworkRequestsByUrl(urlPattern: string | RegExp): NetworkRequestEntry[] {
    const pattern = typeof urlPattern === 'string' ? new RegExp(urlPattern) : urlPattern;
    return this.networkRequests.filter(req => pattern.test(req.url));
  }

  /**
   * Clear captured network requests
   */
  clearNetworkRequests(): void {
    this.networkRequests = [];
    this.logger.info('Cleared captured network requests');
  }

  /**
   * Get summary of captured network requests
   * @returns Summary object with counts and statistics
   */
  getNetworkRequestSummary(): {
    total: number;
    successful: number;
    failed: number;
    pending: number;
    averageDuration: number;
    methods: Record<string, number>;
  } {
    const total = this.networkRequests.length;
    const successful = this.getSuccessfulNetworkRequests().length;
    const failed = this.getFailedNetworkRequests().length;
    const pending = this.networkRequests.filter(req => req.status === undefined).length;
    
    const completedRequests = this.networkRequests.filter(req => req.duration !== undefined);
    const averageDuration = completedRequests.length > 0
      ? completedRequests.reduce((sum, req) => sum + (req.duration || 0), 0) / completedRequests.length
      : 0;

    const methods: Record<string, number> = {};
    this.networkRequests.forEach(req => {
      methods[req.method] = (methods[req.method] || 0) + 1;
    });

    return {
      total,
      successful,
      failed,
      pending,
      averageDuration: Math.round(averageDuration),
      methods
    };
  }

  /**
   * Ensure log directory exists
   */
  private ensureLogDirectory(): void {
    const logDir = path.join(process.cwd(), 'log');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  /**
   * Generate log file name with timestamp
   */
  private generateLogFileName(prefix: string, extension: string = 'txt'): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').split('.')[0];
    const className = this.constructor.name;
    return `${prefix}_${className}_${timestamp}.${extension}`;
  }

  /**
   * Save console logs to a text file in the log folder
   * @param fileName Optional custom file name (default: auto-generated)
   * @returns Path to the saved file
   */
  async saveConsoleLogsToFile(fileName?: string): Promise<string> {
    this.ensureLogDirectory();
    const logDir = path.join(process.cwd(), 'log');
    const file = fileName || this.generateLogFileName('console-logs');
    const filePath = path.join(logDir, file);

    const logs = this.getConsoleLogs();
    let content = '='.repeat(80) + '\n';
    content += `CONSOLE LOGS CAPTURE REPORT\n`;
    content += `Generated: ${new Date().toISOString()}\n`;
    content += `Page: ${this.constructor.name}\n`;
    content += `Total Logs Captured: ${logs.length}\n`;
    content += '='.repeat(80) + '\n\n';

    if (logs.length === 0) {
      content += 'No console logs captured.\n';
    } else {
      logs.forEach((log, index) => {
        content += `[${index + 1}] ${log.type.toUpperCase()}: ${log.text}\n`;
        if (log.location?.url) {
          content += `    Location: ${log.location.url}:${log.location.lineNumber}:${log.location.columnNumber}\n`;
        }
        content += `    Timestamp: ${log.timestamp.toISOString()}\n`;
        content += '\n';
      });
    }

    // Add summary by type
    content += '\n' + '='.repeat(80) + '\n';
    content += 'SUMMARY BY TYPE\n';
    content += '='.repeat(80) + '\n';
    const types = ['log', 'debug', 'info', 'warning', 'error'] as const;
    types.forEach(type => {
      const count = logs.filter(l => l.type === type).length;
      if (count > 0) {
        content += `${type.toUpperCase()}: ${count}\n`;
      }
    });

    try {
      fs.writeFileSync(filePath, content, 'utf8');
      this.logger.info(`Console logs saved to: ${filePath}`);
      return filePath;
    } catch (error) {
      this.logger.error(`Failed to save console logs to file: ${filePath}`, error as Error);
      throw error;
    }
  }

  /**
   * Save console errors to a text file in the log folder
   * @param fileName Optional custom file name (default: auto-generated)
   * @returns Path to the saved file
   */
  async saveConsoleErrorsToFile(fileName?: string): Promise<string> {
    this.ensureLogDirectory();
    const logDir = path.join(process.cwd(), 'log');
    const file = fileName || this.generateLogFileName('console-errors');
    const filePath = path.join(logDir, file);

    const errors = this.getConsoleErrors();
    let content = '='.repeat(80) + '\n';
    content += `CONSOLE ERRORS REPORT\n`;
    content += `Generated: ${new Date().toISOString()}\n`;
    content += `Page: ${this.constructor.name}\n`;
    content += `Total Errors: ${errors.length}\n`;
    content += '='.repeat(80) + '\n\n';

    if (errors.length === 0) {
      content += '✅ No console errors found!\n';
    } else {
      errors.forEach((error, index) => {
        content += `[${index + 1}] ERROR: ${error.text}\n`;
        if (error.location?.url) {
          content += `    Location: ${error.location.url}:${error.location.lineNumber}:${error.location.columnNumber}\n`;
        }
        content += `    Timestamp: ${error.timestamp.toISOString()}\n`;
        content += '\n';
      });
    }

    try {
      fs.writeFileSync(filePath, content, 'utf8');
      this.logger.info(`Console errors saved to: ${filePath}`);
      return filePath;
    } catch (error) {
      this.logger.error(`Failed to save console errors to file: ${filePath}`, error as Error);
      throw error;
    }
  }

  /**
   * Save network requests to a text file in the log folder
   * @param fileName Optional custom file name (default: auto-generated)
   * @returns Path to the saved file
   */
  async saveNetworkRequestsToFile(fileName?: string): Promise<string> {
    this.ensureLogDirectory();
    const logDir = path.join(process.cwd(), 'log');
    const file = fileName || this.generateLogFileName('network-requests');
    const filePath = path.join(logDir, file);

    const requests = this.getNetworkRequests();
    let content = '='.repeat(80) + '\n';
    content += `NETWORK REQUESTS CAPTURE REPORT\n`;
    content += `Generated: ${new Date().toISOString()}\n`;
    content += `Page: ${this.constructor.name}\n`;
    content += `Total Requests Captured: ${requests.length}\n`;
    content += '='.repeat(80) + '\n\n';

    if (requests.length === 0) {
      content += 'No network requests captured.\n';
    } else {
      requests.forEach((req, index) => {
        const statusIcon = req.status 
          ? (req.status >= 200 && req.status < 300 ? '✅' : req.status >= 400 ? '❌' : '⚠️')
          : '⏳';
        content += `[${index + 1}] ${statusIcon} ${req.method} ${req.url}\n`;
        if (req.status) {
          content += `    Status: ${req.status} ${req.statusText || ''}\n`;
        }
        if (req.duration !== undefined) {
          content += `    Duration: ${req.duration}ms\n`;
        }
        if (req.resourceType) {
          content += `    Resource Type: ${req.resourceType}\n`;
        }
        content += `    Timestamp: ${req.timestamp.toISOString()}\n`;
        
        if (req.requestHeaders && Object.keys(req.requestHeaders).length > 0) {
          content += `    Request Headers:\n`;
          Object.entries(req.requestHeaders).forEach(([key, value]) => {
            content += `      ${key}: ${value}\n`;
          });
        }
        
        if (req.requestBody) {
          content += `    Request Body: ${JSON.stringify(req.requestBody, null, 2)}\n`;
        }
        
        if (req.responseHeaders && Object.keys(req.responseHeaders).length > 0) {
          content += `    Response Headers:\n`;
          Object.entries(req.responseHeaders).forEach(([key, value]) => {
            content += `      ${key}: ${value}\n`;
          });
        }
        
        if (req.responseBody) {
          const bodyStr = typeof req.responseBody === 'string' 
            ? req.responseBody 
            : JSON.stringify(req.responseBody, null, 2);
          content += `    Response Body: ${bodyStr.substring(0, 1000)}${bodyStr.length > 1000 ? '... (truncated)' : ''}\n`;
        }
        
        content += '\n';
      });
    }

    // Add summary
    const summary = this.getNetworkRequestSummary();
    content += '\n' + '='.repeat(80) + '\n';
    content += 'NETWORK SUMMARY\n';
    content += '='.repeat(80) + '\n';
    content += `Total Requests: ${summary.total}\n`;
    content += `✅ Successful: ${summary.successful}\n`;
    content += `❌ Failed: ${summary.failed}\n`;
    content += `⏳ Pending: ${summary.pending}\n`;
    content += `⏱️  Average Duration: ${summary.averageDuration}ms\n`;
    content += '\nMethods Breakdown:\n';
    Object.entries(summary.methods).forEach(([method, count]) => {
      content += `  ${method}: ${count}\n`;
    });

    try {
      fs.writeFileSync(filePath, content, 'utf8');
      this.logger.info(`Network requests saved to: ${filePath}`);
      return filePath;
    } catch (error) {
      this.logger.error(`Failed to save network requests to file: ${filePath}`, error as Error);
      throw error;
    }
  }

  /**
   * Save failed network requests to a text file in the log folder
   * @param fileName Optional custom file name (default: auto-generated)
   * @returns Path to the saved file
   */
  async saveFailedNetworkRequestsToFile(fileName?: string): Promise<string> {
    this.ensureLogDirectory();
    const logDir = path.join(process.cwd(), 'log');
    const file = fileName || this.generateLogFileName('network-errors');
    const filePath = path.join(logDir, file);

    const failed = this.getFailedNetworkRequests();
    let content = '='.repeat(80) + '\n';
    content += `FAILED NETWORK REQUESTS REPORT\n`;
    content += `Generated: ${new Date().toISOString()}\n`;
    content += `Page: ${this.constructor.name}\n`;
    content += `Total Failed Requests: ${failed.length}\n`;
    content += '='.repeat(80) + '\n\n';

    if (failed.length === 0) {
      content += '✅ No failed requests!\n';
    } else {
      failed.forEach((req, index) => {
        content += `[${index + 1}] ${req.method} ${req.url}\n`;
        content += `    Status: ${req.status} ${req.statusText || ''}\n`;
        if (req.duration !== undefined) {
          content += `    Duration: ${req.duration}ms\n`;
        }
        content += `    Timestamp: ${req.timestamp.toISOString()}\n`;
        if (req.requestHeaders && Object.keys(req.requestHeaders).length > 0) {
          content += `    Request Headers:\n`;
          Object.entries(req.requestHeaders).forEach(([key, value]) => {
            content += `      ${key}: ${value}\n`;
          });
        }
        content += '\n';
      });
    }

    try {
      fs.writeFileSync(filePath, content, 'utf8');
      this.logger.info(`Failed network requests saved to: ${filePath}`);
      return filePath;
    } catch (error) {
      this.logger.error(`Failed to save failed network requests to file: ${filePath}`, error as Error);
      throw error;
    }
  }

  /**
   * Save all captured data (console logs and network requests) to files
   * @param prefix Optional prefix for file names
   * @returns Object with paths to saved files
   */
  async saveAllCapturedDataToFiles(prefix?: string): Promise<{
    consoleLogs: string;
    consoleErrors: string;
    networkRequests: string;
    failedRequests: string;
  }> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').split('.')[0];
    const filePrefix = prefix ? `${prefix}_${timestamp}` : timestamp;

    const consoleLogs = await this.saveConsoleLogsToFile(`console-logs_${filePrefix}.txt`);
    const consoleErrors = await this.saveConsoleErrorsToFile(`console-errors_${filePrefix}.txt`);
    const networkRequests = await this.saveNetworkRequestsToFile(`network-requests_${filePrefix}.txt`);
    const failedRequests = await this.saveFailedNetworkRequestsToFile(`network-errors_${filePrefix}.txt`);

    this.logger.info('All captured data saved to log folder');
    
    return {
      consoleLogs,
      consoleErrors,
      networkRequests,
      failedRequests
    };
  }
}