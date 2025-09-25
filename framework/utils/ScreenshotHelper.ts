/**
 * ScreenshotHelper.ts
 * 
 * A comprehensive utility for managing screenshots in Playwright tests.
 * 
 * This class provides a standardized way to capture, save, and manage screenshots
 * during test execution. It handles various screenshot scenarios including:
 * - Basic page screenshots with automatic naming and organization
 * - Element-specific screenshots for targeted visual testing
 * - Failure screenshots for debugging test failures
 * - Masked screenshots to hide sensitive information
 * - Comparison screenshots for visual regression testing
 * - Screenshots with custom viewport sizes for responsive testing
 * 
 * The helper automatically integrates with Playwright's TestInfo to attach
 * screenshots to test reports and manages the screenshot directory structure.
 * It also provides utilities for cleaning up old screenshots to prevent
 * disk space issues over time.
 * 
 * @example
 * // Basic usage in a test
 * const screenshotHelper = new ScreenshotHelper(page, testInfo);
 * await screenshotHelper.takeScreenshot('login-page');
 * 
 * // Taking element screenshot
 * await screenshotHelper.takeElementScreenshot('.login-form', 'login-form');
 * 
 * // Taking masked screenshot (hiding sensitive data)
 * await screenshotHelper.takeMaskedScreenshot(['.password-field', '.credit-card'], 'payment-form');
 */

import { Page, TestInfo } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './Logger';

export interface ScreenshotOptions {
  fullPage?: boolean;
  clip?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  quality?: number;
  type?: 'png' | 'jpeg';
  animations?: 'disabled' | 'allow';
  caret?: 'hide' | 'initial';
  scale?: 'css' | 'device';
  mask?: any[];
  maskColor?: string;
  threshold?: number;
  thresholdType?: 'pixel' | 'percent';
}

export class ScreenshotHelper {
  private page: Page;
  private testInfo: TestInfo;
  private logger: Logger;
  private screenshotDir: string;

  constructor(page: Page, testInfo: TestInfo) {
    this.page = page;
    this.testInfo = testInfo;
    this.logger = new Logger('ScreenshotHelper');
    this.screenshotDir = path.join(process.cwd(), 'screenshots');
    this.ensureScreenshotDirectory();
  }

  /**
   * Take a screenshot with automatic naming
   */
  async takeScreenshot(
    name?: string,
    options: ScreenshotOptions = {}
  ): Promise<string> {
    const screenshotName = name || `screenshot-${Date.now()}`;
    const fileName = this.generateFileName(screenshotName);
    const filePath = path.join(this.screenshotDir, fileName);

    const defaultOptions: ScreenshotOptions = {
      fullPage: true,
      type: 'png',
      animations: 'disabled',
      caret: 'hide',
      ...options
    };

    try {
      this.logger.info(`Taking screenshot: ${fileName}`);
      await this.page.screenshot({
        path: filePath,
        ...defaultOptions
      });

      // Attach to test report if testInfo is available
      if (this.testInfo) {
        await this.testInfo.attach(screenshotName, {
          path: filePath,
          contentType: `image/${defaultOptions.type}`
        });
      }

      this.logger.info(`Screenshot saved: ${filePath}`);
      return filePath;
    } catch (error) {
      this.logger.error(`Failed to take screenshot: ${fileName}`, error as Error);
      throw error;
    }
  }

  /**
   * Take screenshot on test failure
   */
  async takeFailureScreenshot(): Promise<string> {
    const testName = this.testInfo.title.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `FAILURE_${testName}_${Date.now()}`;
    
    return await this.takeScreenshot(fileName, {
      fullPage: true,
      type: 'png'
    });
  }

  /**
   * Take screenshot of specific element
   */
  async takeElementScreenshot(
    selector: string,
    name?: string,
    options: ScreenshotOptions = {}
  ): Promise<string> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible' });

    const screenshotName = name || `element-${selector.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}`;
    const fileName = this.generateFileName(screenshotName);
    const filePath = path.join(this.screenshotDir, fileName);

    const defaultOptions: ScreenshotOptions = {
      type: 'png',
      animations: 'disabled',
      ...options
    };

    try {
      this.logger.info(`Taking element screenshot: ${fileName}`);
      await element.screenshot({
        path: filePath,
        ...defaultOptions
      });

      if (this.testInfo) {
        await this.testInfo.attach(screenshotName, {
          path: filePath,
          contentType: `image/${defaultOptions.type}`
        });
      }

      this.logger.info(`Element screenshot saved: ${filePath}`);
      return filePath;
    } catch (error) {
      this.logger.error(`Failed to take element screenshot: ${fileName}`, error as Error);
      throw error;
    }
  }

  /**
   * Take comparison screenshot for visual testing
   */
  async takeComparisonScreenshot(
    name: string,
    options: ScreenshotOptions = {}
  ): Promise<string> {
    const fileName = this.generateFileName(`comparison_${name}`);
    const filePath = path.join(this.screenshotDir, 'comparisons', fileName);
    
    // Ensure comparison directory exists
    const comparisonDir = path.dirname(filePath);
    if (!fs.existsSync(comparisonDir)) {
      fs.mkdirSync(comparisonDir, { recursive: true });
    }

    const defaultOptions: ScreenshotOptions = {
      fullPage: true,
      type: 'png',
      animations: 'disabled',
      caret: 'hide',
      ...options
    };

    try {
      this.logger.info(`Taking comparison screenshot: ${fileName}`);
      await this.page.screenshot({
        path: filePath,
        ...defaultOptions
      });

      this.logger.info(`Comparison screenshot saved: ${filePath}`);
      return filePath;
    } catch (error) {
      this.logger.error(`Failed to take comparison screenshot: ${fileName}`, error as Error);
      throw error;
    }
  }

  /**
   * Take screenshot with mask (hide sensitive data)
   */
  async takeMaskedScreenshot(
    maskSelectors: string[],
    name?: string,
    options: ScreenshotOptions = {}
  ): Promise<string> {
    const maskElements = maskSelectors.map(selector => this.page.locator(selector));
    
    const screenshotOptions: ScreenshotOptions = {
      ...options,
      mask: maskElements,
      maskColor: options.maskColor || '#FF0000'
    };

    const screenshotName = name || `masked-screenshot-${Date.now()}`;
    return await this.takeScreenshot(screenshotName, screenshotOptions);
  }

  /**
   * Take screenshot after waiting for network idle
   */
  async takeScreenshotAfterNetworkIdle(
    name?: string,
    options: ScreenshotOptions = {},
    timeout: number = 30000
  ): Promise<string> {
    try {
      this.logger.info('Waiting for network idle before screenshot');
      await this.page.waitForLoadState('networkidle', { timeout });
      return await this.takeScreenshot(name, options);
    } catch (error) {
      this.logger.warn('Network idle timeout, taking screenshot anyway');
      return await this.takeScreenshot(name, options);
    }
  }

  /**
   * Take screenshot with custom viewport
   */
  async takeScreenshotWithViewport(
    width: number,
    height: number,
    name?: string,
    options: ScreenshotOptions = {}
  ): Promise<string> {
    const originalViewport = this.page.viewportSize();
    
    try {
      this.logger.info(`Setting viewport to ${width}x${height} for screenshot`);
      await this.page.setViewportSize({ width, height });
      
      const screenshotName = name || `viewport-${width}x${height}-${Date.now()}`;
      const result = await this.takeScreenshot(screenshotName, options);
      
      return result;
    } finally {
      // Restore original viewport
      if (originalViewport) {
        await this.page.setViewportSize(originalViewport);
        this.logger.info('Viewport restored to original size');
      }
    }
  }

  /**
   * Clean up old screenshots
   */
  async cleanupOldScreenshots(daysOld: number = 7): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const files = fs.readdirSync(this.screenshotDir);
      let deletedCount = 0;

      for (const file of files) {
        const filePath = path.join(this.screenshotDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      }

      this.logger.info(`Cleaned up ${deletedCount} old screenshots`);
    } catch (error) {
      this.logger.error('Failed to cleanup old screenshots', error as Error);
    }
  }

  /**
   * Get screenshot directory path
   */
  getScreenshotDirectory(): string {
    return this.screenshotDir;
  }

  /**
   * Set custom screenshot directory
   */
  setScreenshotDirectory(directory: string): void {
    this.screenshotDir = directory;
    this.ensureScreenshotDirectory();
  }

  /**
   * Generate unique filename for screenshot
   */
  private generateFileName(baseName: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const testName = this.testInfo.title.replace(/[^a-zA-Z0-9]/g, '_');
    return `${testName}_${baseName}_${timestamp}.png`;
  }

  /**
   * Ensure screenshot directory exists
   */
  private ensureScreenshotDirectory(): void {
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
      this.logger.info(`Created screenshot directory: ${this.screenshotDir}`);
    }
  }
}