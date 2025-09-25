import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';
import { LoginPageLocators } from '../locators/LoginPageLocators';

export interface LoginCredentials {
  mobileNumber: string;
  password: string;
}

export class LoginPage extends BasePage {
  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    super(page, url || 'https://aks-panel.sadad.qa/auth/login', testInfo);
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin(): Promise<void> {
    await this.navigate();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Enter mobile number
   */
  async enterMobileNumber(mobileNumber: string): Promise<void> {
    await this.fill(LoginPageLocators.mobileNumberField, mobileNumber);
    this.logger.info(`Mobile number entered: ${mobileNumber}`);
  }

  /**
   * Enter password
   */
  async enterPassword(password: string): Promise<void> {
    await this.fill(LoginPageLocators.passwordField, password);
    this.logger.info('Password entered');
  }

  /**
   * Click login button
   */
  async clickLoginButton(): Promise<void> {
    await this.click(LoginPageLocators.loginButton);
    this.logger.info('Login button clicked');
  }

  /**
   * Perform complete login with credentials
   */
  async login(credentials: LoginCredentials): Promise<void> {
    this.logger.info(`Attempting login for mobile: ${credentials.mobileNumber}`);
    
    await this.getTextAndCompare(LoginPageLocators.pageTitle, ' Merchant Panel ');
    await this.enterMobileNumber(credentials.mobileNumber);
    await this.enterPassword(credentials.password);
    await this.waitUntilElementClickable(LoginPageLocators.loginButton, 6000);
    await this.clickLoginButton();
    
    this.logger.info('Login attempt completed');
  }

  /**
   * Verify login page elements are present
   */
  async verifyLoginPageElements(): Promise<void> {
    this.logger.info('Verifying login page elements');
    
    await this.waitForVisible(LoginPageLocators.mobileNumberField);
    await this.waitForVisible(LoginPageLocators.passwordField);
    await this.waitForVisible(LoginPageLocators.loginButton);
    
    this.logger.info('All login page elements verified');
  }
}