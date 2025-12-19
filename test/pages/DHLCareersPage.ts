import { Page, TestInfo, expect } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';
import { DHLCareersPageLocators } from '../locators/DHLCareersPageLocators';

export class DHLCareersPage extends BasePage {
  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    super(page, url, testInfo);
  }

  /**
   * Navigate to the careers page
   */
  async open(): Promise<void> {
    if (this.url) {
      await this.navigateTo(this.url);
    }
  }

  /**
   * Verify page content matches the provided data
   * Uses getTextAndCompare for text verification
   */
  async verifyPageContent(data: any): Promise<void> {
    this.logger.info('Verifying page content against provided JSON data');
    // Accept all cookies
    await this.waitForVisible(DHLCareersPageLocators.acceptAll);
    if (await this.isVisible(DHLCareersPageLocators.acceptAll)) {
      await this.click(DHLCareersPageLocators.acceptAll);
    }

    await this.getTextAndCompare(DHLCareersPageLocators.titleText, data.page_title,true,true);
    // Verify Page Title
    if (data.page_title) {
      await this.verifyTitle(data.page_title, true);
    }

    // Verify Hero Heading
    await this.getTextAndCompare(this.byText(data.hero_heading).first(), data.hero_heading, false, true);

    // Verify Hero Subheading
    await this.getTextAndCompare(this.byText(data.hero_subheading).first(), data.hero_subheading, false, true);

    // Verify Section: Our Locations
    await this.getTextAndCompare(this.byText(data.section_our_locations).first(), data.section_our_locations, false, true);

    // Verify Section Description
    await this.getTextAndCompare(this.byText(data.section_our_locations_description).first(), data.section_our_locations_description, false, true);

    // Verify Browse Jobs Label
    await this.getTextAndCompare(this.byText(data.browse_jobs_label).first(), data.browse_jobs_label, false, true);

    // Verify Footer Copyright
    await this.getTextAndCompare(this.byText(data.footer_copyright).first(), data.footer_copyright, false, true);

    // Verify Job Categories
    if (data.job_categories) {
        for (const [key, value] of Object.entries(data.job_categories)) {
            const categoryName = value as string;
            // Check if the category link/text exists
            await this.getTextAndCompare(this.byText(categoryName).first(), categoryName, false, true);
        }
    }

    // Verify Footer Links
    if (data.footer_links) {
        for (const [key, value] of Object.entries(data.footer_links)) {
            const linkText = value as string;
            await this.getTextAndCompare(this.byText(linkText).first(), linkText, false, true);
        }
    }
  }
}
