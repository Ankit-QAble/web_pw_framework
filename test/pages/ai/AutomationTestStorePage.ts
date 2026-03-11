import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../../framework/core/BasePage';
import { AutomationTestStoreLocators as locators } from '../../locators/ai/AutomationTestStoreLocators';

export class AutomationTestStorePage extends BasePage {
  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    const defaultUrl = (global as any).selectedProfile?.baseURL || process.env.BASE_URL;
    super(page, url || defaultUrl, testInfo);
  }

  async open(): Promise<void> {
    await this.navigate();
    await this.waitForPageLoad();
  }

  async login(username: string, password: string): Promise<void> {
    await this.click(locators.loginNameInput);
    await this.fill(locators.loginNameInput, username);
    await this.click(locators.passwordInput);
    await this.fill(locators.passwordInput, password);
    await this.waitUntilElementClickable(locators.loginButton);
    await this.click(locators.loginButton);
    await this.waitForPageLoad();
  }

  async verifyHomeLinkVisible(): Promise<void> {
    await this.waitForVisible(locators.siteHeaderLink);
  }

  async goToMenAndVerifyCategories(): Promise<void> {
    await this.click(locators.menCategoryLink);
    await this.waitForVisible(locators.categoryItemBodyShower);
    await this.waitForVisible(locators.categoryItemFragranceSets);
    await this.waitForVisible(locators.categoryItemPreShaveShaving);
  }

  async openBodyAndShowerAndAddTwoItems(): Promise<void> {
    await this.click(locators.bodyShowerLink);
    await this.verifyText(locators.mainContainer, '$6.70', false);
    await this.click(this.locator(locators.addToCartButton).first());
    await this.click(this.locator(locators.addToCartButton).first());
  }

  async verifyCartHeaderVisible(): Promise<void> {
    await this.waitForVisible(locators.cartMiniHeader);
  }

  async openCart(): Promise<void> {
    if (await this.isVisible(locators.cartMiniHeader, 2000)) {
      await this.click(locators.cartMiniHeader);
    } else if (await this.isVisible(this.locator(locators.viewCartButton).first(), 2000)) {
      await this.click(this.locator(locators.viewCartButton).first());
    } else {
      await this.click(locators.cartLink);
    }
    await this.waitForPageLoad();
  }

  async verifyCartTotals(): Promise<void> {
    await this.waitForVisible(locators.cartContainer);
    await this.expectVisible(this.byText('Sub-Total'));
    await this.expectVisible(this.byText('Total'));
    await this.click(this.locator(locators.delete).first());
  }
}
