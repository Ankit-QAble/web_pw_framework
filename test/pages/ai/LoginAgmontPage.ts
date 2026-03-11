import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../../framework/core/BasePage';
import { LoginAgmontLocators as locators } from '../../locators/ai/LoginAgmontLocators';

export class LoginAgmontPage extends BasePage {
  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    const defaultUrl = (global as any).selectedProfile?.baseURL || process.env.BASE_URL;
    super(page, url || defaultUrl, testInfo);
  }

  async open(): Promise<void> {
    await this.navigate();
    await this.waitForPageLoad();
  }

  async enterEmail(value: string): Promise<void> {
    await this.click(this.byRole('textbox', { name: locators.emailFieldName }));
    await this.fill(this.byRole('textbox', { name: locators.emailFieldName }), value);
  }

  async enterPassword(value: string): Promise<void> {
    await this.click(this.byRole('textbox', { name: locators.passwordFieldName }));
    await this.fill(this.byRole('textbox', { name: locators.passwordFieldName }), value);
  }

  async submitLogin(): Promise<void> {
    await this.waitUntilElementClickable(this.byRole('button', { name: locators.signInButtonName }));
    await this.click(this.byRole('button', { name: locators.signInButtonName }));
    await this.waitForPageLoad();
  }

  async login(email: string, password: string): Promise<void> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.submitLogin();
  }

  async verifyHeader(): Promise<void> {
    await this.getTextAndCompare(locators.subTopbar, locators.subTopbarText, false);
  }

  async verifyUserName(): Promise<void> {
    await this.getTextAndCompare(locators.topbar, locators.topbarUserFullName, false);
  }

  async verifyFiltersVisible(): Promise<void> {
    await this.expectVisible(this.byText(locators.certificateText));
    await this.expectVisible(this.byText(locators.growthMethodText));
  }
}
