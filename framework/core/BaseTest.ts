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
}

export { expect } from '@playwright/test';