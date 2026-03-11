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
    //await this.click(locators.usernameInput);
    await this.fill(locators.usernameInput, username);
    await this.takeScreenshot('usernameEntered');
    //await this.click(locators.passwordInput);
    await this.fill(locators.passwordInput, password);
    await this.takeScreenshot('passwordEntered');
    await this.click(locators.loginButton);
  }

  async waitForInventoryVisible(): Promise<void> {
    await this.waitForVisible(this.locator(locators.inventoryItemDescription).first());
  }

  async getHeaderText(): Promise<string> {
    return await this.getText(locators.primaryHeader);
  }

  async getInventoryListText(): Promise<string> {
    const text = await this.getText(locators.inventoryList);
    await this.takeScreenshot('inventoryList');
    return text;
  }

  async getErrorMessage(): Promise<string> {
    await this.expectVisible('[data-test="error"]');
    return this.getText('[data-test="error"]');
  }

  async verifyErrorMessage(expectedMessage: string): Promise<void> {
    const errorText = await this.getErrorMessage();
    if (!errorText.includes(expectedMessage)) {
      throw new Error(`Expected error message containing "${expectedMessage}" but got "${errorText}"`);
    }
  }

  async verifyInventoryPageLoaded(): Promise<void> {
    await this.expectVisible(locators.inventoryList);
  }

  async verifyLoginPageDisplayed(): Promise<void> {
    await this.expectVisible(locators.usernameInput);
    await this.expectVisible(locators.passwordInput);
    await this.expectVisible(locators.loginButton);
  }

  // Cart and product actions
  async addBackpackToCart(): Promise<void> {
    await this.click(locators.addToCartBackpack);
  }

  async addBikeLightToCart(): Promise<void> {
    await this.click(locators.addToCartBikeLight);
  }

  async getRemoveBackpackText(): Promise<string> {
    return await this.getText(locators.removeBackpack);
  }

  async openCart(): Promise<void> {
    await this.click(locators.shoppingCartLink);
  }

  async getCartListText(): Promise<string> {
    return await this.getText(locators.cartList);
  }

  async expectCartActionsVisible(): Promise<void> {
    await this.expectVisible(locators.continueShopping);
    await this.expectVisible(locators.checkout);
  }

  async goToCheckout(): Promise<void> {
    await this.click(locators.checkout);
  }

  async getCheckoutTitle(): Promise<string> {
    return await this.getText(locators.title);
  }

  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fill(locators.firstName, firstName);
    await this.fill(locators.lastName, lastName);
    await this.fill(locators.postalCode, postalCode);
  }

  async continueCheckout(): Promise<void> {
    await this.click(locators.continue);
  }

  async getTotalLabel(): Promise<string> {
    return await this.getText(locators.totalLabel);
  }

  async getSubtotalLabel(): Promise<string> {
    return await this.getText(locators.subtotalLabel);
  }

  async getTaxLabel(): Promise<string> {
    return await this.getText(locators.taxLabel);
  }

  async expectFinishVisible(): Promise<void> {
    await this.expectVisible(locators.finish);
  }

  async finishCheckout(): Promise<void> {
    await this.click(locators.finish);
  }

  async getCompleteHeader(): Promise<string> {
    return await this.getText(locators.completeHeader);
  }

  completeContainer() {
    return this.locator(locators.completeContainer);
  }
  async loginWithInvalidCredentials(username: string, password: string): Promise<void> {
    await this.click(locators.usernameInput);
    await this.fill(locators.usernameInput, username);
    await this.click(locators.passwordInput);
    await this.fill(locators.passwordInput, password);
    await this.click(locators.loginButton);
  }

  async loginWithEmptyUsername(password: string): Promise<void> {
    await this.click(locators.passwordInput);
    await this.fill(locators.passwordInput, password);
    await this.click(locators.loginButton);
  }

  async loginWithEmptyPassword(username: string): Promise<void> {
    await this.click(locators.usernameInput);
    await this.fill(locators.usernameInput, username);
    await this.click(locators.loginButton);
  }

  async loginWithBothEmpty(): Promise<void> {
    await this.click(locators.loginButton);
  }
}
