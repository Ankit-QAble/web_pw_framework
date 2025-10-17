import { Page, TestInfo, expect } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';
import { BlogPageLocators } from '../locators/qablePageLocators';


export class BlogPage extends BasePage {
  private userData: any;

  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    // Use the URL from config or fallback to the provided URL
    const defaultUrl = process.env.BASE_URL;
    console.log(`🔍 LoginPage constructor - url param: ${url}, defaultUrl: ${defaultUrl}`);
    super(page, url || defaultUrl, testInfo);
    console.log(`🔍 LoginPage constructor - final URL: ${this.url}`);
    
  }
  /**
   * Navigate to login page
   */
  async navigateToInsights(): Promise<void> {
    try {
      this.logger.info(`Navigating to Insights: ${this.url}`);
      await this.navigate();
    } catch (error) {
      this.logger.error('Failed to navigate to Insights page', error as Error);
      await this.takeScreenshot('navigation-failed');
      throw error;
    }
  }

  /**
   * Enter mobile number
   */
  async enterBlogTitle(): Promise<void> {
    await this.fill(BlogPageLocators.searchBox, "Playwright");
    await this.page.keyboard.press('Enter');
    this.logger.info(`Blog title entered: Playwright`);
  }

  /**
   * Verify login page elements are present
   */
  async verifyBlogTitle(): Promise<void> {
    this.logger.info('Verifying login page elements');
    await this.waitForVisible(BlogPageLocators.blogTitle,10000);
    this.logger.info('Playwright blog title verified');
    await this.waitForVisible(BlogPageLocators.blogPublishedDate,10000);
    const publishedDate = await this.getText(BlogPageLocators.blogPublishedDate);
    const expectedPublishedDate = "October 15, 2025";
    expect(publishedDate).toBe(expectedPublishedDate);
    this.logger.info('Playwright blog published date verified');
  }
  
}