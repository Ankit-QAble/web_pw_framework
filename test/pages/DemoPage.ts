import { Page, TestInfo, expect } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';
import { DemoPageLocators } from '../locators/DemoPageLocators';
import { testData } from '../../framework/utils/DataHelper';

export interface OrangeHrmCredentials {
  username: string;
  password: string;
}

interface OrangeHrmTestData {
  url?: string;
  validUsers?: OrangeHrmCredentials[];
  invalidUsers?: Array<OrangeHrmCredentials & { expectedError?: string }>;
}

export class DemoPage extends BasePage {
  private readonly orangeHrmData: OrangeHrmTestData;

  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    const data = testData.users.orangeHrm as OrangeHrmTestData | undefined;
    const defaultUrl =
      url ||
      process.env.ORANGE_HRM_URL ||
      data?.url ||
      'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

    super(page, defaultUrl, testInfo);
    this.orangeHrmData = data ?? {};
    this.logger.info(`OrangeHRM target URL: ${this.url}`);
  }

  /**
   * Load the login page and verify core elements
   */
  async open(): Promise<void> {
    await this.navigate();
    await this.verifyLoginPageLoaded();
  }

  /**
   * Verify login page controls are ready for interaction
   */
  async verifyLoginPageLoaded(): Promise<void> {
    await this.waitForPageLoad();
    await this.waitUntilElementPresent(DemoPageLocators.loginContainer, 15000);
    await this.waitForVisible(DemoPageLocators.loginTitle, 10000);
    await this.verifyText(DemoPageLocators.loginTitle, 'Login');
    await this.expectVisible(DemoPageLocators.usernameField, 'Username field should be visible');
    await this.expectVisible(DemoPageLocators.passwordField, 'Password field should be visible');
    await this.expectVisible(DemoPageLocators.loginButton, 'Login button should be visible');
    await this.waitForVisible(DemoPageLocators.forgotPasswordLink, 5000);
    await this.waitForVisible(DemoPageLocators.companyBrandingImage, 5000);
    await this.takeScreenshot('orangehrm-login-page');
    this.logger.info('Login page verified successfully');
  }

  /**
   * Enter username using BasePage fill helper
   */
  async enterUsername(username: string): Promise<void> {
    await this.fill(DemoPageLocators.usernameField, username);
    this.logger.info(`Username entered: ${username}`);
  }

  /**
   * Enter password using BasePage fill helper
   */
  async enterPassword(password: string): Promise<void> {
    await this.fill(DemoPageLocators.passwordField, password);
    this.logger.info('Password entered');
  }

  /**
   * Click the login button with additional readiness checks
   */
  async submitLogin(): Promise<void> {
    await this.waitUntilElementClickable(DemoPageLocators.loginButton, 10000);
    await this.click(DemoPageLocators.loginButton);
    await this.waitForNavigation();
  }

  /**
   * Retrieve default valid credentials
   */
  getValidCredentials(): OrangeHrmCredentials {
    if (this.orangeHrmData.validUsers && this.orangeHrmData.validUsers.length > 0) {
      return this.orangeHrmData.validUsers[0];
    }

    return {
      username: process.env.ORANGE_HRM_USERNAME ?? 'Admin',
      password: process.env.ORANGE_HRM_PASSWORD ?? 'admin123'
    };
  }


  /**
   * Perform a full login flow
   */
  async loginWith(credentials: OrangeHrmCredentials): Promise<void> {
    this.logger.info(`Attempting login for OrangeHRM user: ${credentials.username}`);

    try {
      await this.enterUsername(credentials.username);
      await this.enterPassword(credentials.password);
      await this.submitLogin();
    } catch (error) {
      this.logger.error('Login flow failed', error as Error);
      await this.takeScreenshot('orangehrm-login-error');
      throw error;
    }
  }

  /**
   * Validate that the dashboard is displayed after successful login
   */
  async verifyDashboardLoaded(): Promise<void> {
    await this.waitForVisible(DemoPageLocators.dashboardHeader, 20000);
    await this.verifyText(DemoPageLocators.dashboardHeader, 'Dashboard');
    await this.waitUntilElementPresent(DemoPageLocators.quickLaunchSection, 10000);
    await this.scrollToQuickLaunch();
    await this.verifyUrlContains('/dashboard');
    await this.takeScreenshot('orangehrm-dashboard');
    this.logger.info('Dashboard verification completed');
  }

  /**
   * Scrolls to quick launch widget to demonstrate scroll helper
   */
  async scrollToQuickLaunch(): Promise<void> {
    const locator = await this.getLocator(DemoPageLocators.quickLaunchSection);
    await this.scrollToElement(locator);
  }

  /**
   * Open the user dropdown in the top navigation
   */
  async openUserMenu(): Promise<void> {
    await this.waitUntilElementClickable(DemoPageLocators.userDropdownTrigger, 10000);
    await this.click(DemoPageLocators.userDropdownTrigger);
  }

  /**
   * Verify that the logout option is visible
   */
  async isLogoutOptionVisible(): Promise<boolean> {
    return await this.isVisible(DemoPageLocators.logoutLink);
  }

  /**
   * Logout from the application
   */
  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.waitUntilElementClickable(DemoPageLocators.logoutLink, 5000);
    await this.click(DemoPageLocators.logoutLink);
    await this.waitForNavigation();
    await this.waitForVisible(DemoPageLocators.loginTitle, 10000);
    this.logger.info('Successfully logged out from OrangeHRM');
  }

}
