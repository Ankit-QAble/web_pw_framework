import { Page, TestInfo } from '@playwright/test';
import { SimplePageLocators } from '../locators/simplePageLocator';
import { BasePage } from '../../framework/core/BasePage';

export class SimplePage extends BasePage {
    constructor(page: Page, url?: string, testInfo?: TestInfo) {
      // Use the URL from config or fallback to the provided URL
      const defaultUrl = (global as any).selectedProfile?.baseURL || process.env.BASE_URL;
      console.log(`🔍 SimplePage constructor - url param: ${url}, defaultUrl: ${defaultUrl}`);
      super(page, url || defaultUrl, testInfo);
      console.log(`🔍 SimplePage constructor - final URL: ${this.url}`);
    }

    /**
     * Open the page by navigating to the URL
     */
    async open(): Promise<void> {
        await this.navigate();
        await this.waitForPageLoad();
    }

    async googleClick(): Promise<void> {
        await this.click(SimplePageLocators.clickSearchCombobox);
        await this.takeScreenshot('google-page-loaded');
            
    }

    async googleSearch(): Promise<void> {
        await this.fill(SimplePageLocators.searchCombobox, 'playwright agent');
    }

    /**
     * Start capturing console logs and save to file
     */
    async startCapturingConsoleLogs(): Promise<void> {
        await this.captureConsoleLogs();
    }

    /**
     * Start capturing network requests and save to file
     */
    async startCapturingNetworkRequests(): Promise<void> {
        await this.captureNetworkRequests();
    }

    /**
     * Save all captured console logs to file
     */
    async saveConsoleLogs(): Promise<string> {
        return await this.saveConsoleLogsToFile();
    }

    /**
     * Save console errors to file
     */
    async saveConsoleErrors(): Promise<string> {
        return await this.saveConsoleErrorsToFile();
    }

    /**
     * Save network requests to file
     */
    async saveNetworkRequests(): Promise<string> {
        return await this.saveNetworkRequestsToFile();
    }

    /**
     * Save failed network requests to file
     */
    async saveFailedNetworkRequests(): Promise<string> {
        return await this.saveFailedNetworkRequestsToFile();
    }

    /**
     * Save all captured data (console logs and network requests) to files
     */
    async saveAllCapturedData(): Promise<{
        consoleLogs: string;
        consoleErrors: string;
        networkRequests: string;
        failedRequests: string;
    }> {
        return await this.saveAllCapturedDataToFiles();
    }
}
