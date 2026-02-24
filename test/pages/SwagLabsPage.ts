import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';
import { SwagLabsLocators as locators } from '../locators/swagLabsLocators';

export class SwagLabsPage extends BasePage {
  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    const defaultUrl = (global as any).selectedProfile?.baseURL || process.env.BASE_URL;
    super(page, url || defaultUrl, testInfo);
  }

  async open(): Promise<void> {
    await this.navigate();
    await this.waitForPageLoad();
  }

  async login(username: string, password: string): Promise<void> {
    await this.click(locators.usernameInput);
    await this.fill(locators.usernameInput, username);
    await this.click(locators.passwordInput);
    await this.fill(locators.passwordInput, password);
    await this.click(locators.loginButton);
  }

  async waitForInventoryVisible(): Promise<void> {
    await this.waitForVisible(this.locator(locators.inventoryItemDescription).first());
  }

  async getHeaderText(): Promise<string> {
    return this.getText(locators.primaryHeader);
  }

  async getInventoryListText(): Promise<string> {
    return this.getText(locators.inventoryList);
    await this.takeScreenshot('inventoryList.png');
  }
}
