import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';
import { LoginPageLocators } from '../locators/LoginPageLocators';
import { testData } from '../../framework/utils/DataHelper';

export interface LoginCredentials {
  mobileNumber: string;
  password: string;
  otp: string;
}

export class LoginPage extends BasePage {
  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    // Use the URL from config or fallback to the provided URL
    const defaultUrl = process.env.BASE_URL;
    console.log(`🔍 LoginPage constructor - url param: ${url}, defaultUrl: ${defaultUrl}`);
    super(page, url || defaultUrl, testInfo);
    console.log(`🔍 LoginPage constructor - final URL: ${this.url}`);
  }

  /**
   * Get valid user credentials - using testData!
   */
  public getValidUserCredentials(): LoginCredentials {
    const user = testData.validUsers[0];
    console.log(`✅ Using user: ${user.mobileNumber}`);
    return {
      mobileNumber: user.mobileNumber,
      password: user.password,
      otp: user.otp
    };
  }

  /**
   * Get invalid user credentials
   */
  public getInvalidUserCredentials() {
    return testData.invalidUsers[0];
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin(): Promise<void> {
    try {
      this.logger.info(`Navigating to: ${this.url}`);
      await this.navigate();
    } catch (error) {
      this.logger.error('Failed to navigate to login page', error as Error);
      await this.takeScreenshot('navigation-failed');
      throw error;
    }
  }

  /**
   * Enter mobile number
   */
  // async enterMobileNumber(mobileNumber: string): Promise<void> {
  //   await this.fill(LoginPageLocators.mobileNumberField, mobileNumber);
  //   this.logger.info(`Mobile number entered: ${mobileNumber}`);
  // }
  async enterMobileNumber(mobileNumber: string): Promise<void> {
    await this.fill(LoginPageLocators.mobileNumberField, testData.validUsers[0].mobileNumber);
    this.logger.info(`Mobile number entered: ${testData.validUsers[0].mobileNumber}`);
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
    
    try {
      await this.waitForPageLoad();
      await this.waitUntilElementPresent(LoginPageLocators.pageTitle);
      
      await this.getTextAndCompare(LoginPageLocators.pageTitle, 'Login in to SADAD');
      await this.enterMobileNumber(credentials.mobileNumber);
      await this.enterPassword(credentials.password);
      
      // Increase timeout for CI environments
      const clickTimeout = process.env.CI ? 10000 : 6000;
      await this.waitUntilElementClickable(LoginPageLocators.loginButton, clickTimeout);
      await this.clickLoginButton();
      await this.enterOTP(credentials.otp);
      
      this.logger.info('Login attempt completed');
      await this.takeScreenshot('login-successfully-completed');
    } catch (error) {
      this.logger.error('Login failed', error as Error);
      await this.takeScreenshot('login-failed');
      throw error;
    }
  }

  /**
   * Perform complete login with valid credentials from users.json
   */
  async loginWithValidCredentials(): Promise<void> {
    const credentials = this.getValidUserCredentials();
    await this.login(credentials);
  }

  /**
   * Verify login page elements are present
   */
  async verifyLoginPageElements(): Promise<void> {
    this.logger.info('Verifying login page elements');

    
    
    await this.waitForVisible(LoginPageLocators.mobileNumberField,10000);
    await this.waitForVisible(LoginPageLocators.passwordField,10000);
    await this.waitForVisible(LoginPageLocators.loginButton,10000);
    
    this.logger.info('All login page elements verified');
    
  }
  async verifyEnterOTPPage(): Promise<void> {
    this.logger.info('Verifying OTP page elements');
    
    try {
      // Wait for OTP page to load with a longer timeout
      await this.waitForVisible(LoginPageLocators.enterOTPTitle, 15000);
      await this.getTextAndCompare(LoginPageLocators.enterOTPTitle, 'Enter 6 Digit Number');
      this.logger.info('All OTP page elements verified');
    } catch (error) {
      this.logger.error('Failed to verify OTP page elements', error as Error);
      
      // Take screenshot for debugging
      await this.takeScreenshot('otp-page-verification-failed');
      
      // Check current page state
      const currentUrl = this.getCurrentUrl();
      const pageTitle = await this.getTitle();
      this.logger.info(`Current URL: ${currentUrl}`);
      this.logger.info(`Page title: ${pageTitle}`);
      
      // Check if we're still on login page or if there's an error
      const isLoginPageVisible = await this.isVisible(LoginPageLocators.pageTitle);
      this.logger.info(`Login page still visible: ${isLoginPageVisible}`);
      
      if (isLoginPageVisible) {
        this.logger.warn('Still on login page - OTP page may not have loaded');
        // Check for error messages
        const errorElements = await this.page.locator('[class*="error"], [class*="alert"], .error-message').count();
        if (errorElements > 0) {
          const errorText = await this.page.locator('[class*="error"], [class*="alert"], .error-message').first().textContent();
          this.logger.error(`Error message found: ${errorText}`);
        }
      }
      
      throw error;
    }
  }
  async enterOTP(otp: string): Promise<void> {
    this.logger.info('Enter OTP');
    const otpValue = otp;
    
    // Enter each digit individually
    for (let i = 1; i <= 6; i++) {
      const otpInputSelector = `//div[@class='otp-box-main']/div/input[${i}]`;
      const digit = otpValue[i - 1];
      
      this.logger.info(`Entering digit ${i}: ${digit}`);
      await this.waitForVisible(otpInputSelector, 5000);
      await this.fill(otpInputSelector, digit);
      
      // Small delay between inputs to ensure proper entry
      await this.waitForTimeout(200);
    }
    
    this.logger.info('OTP entered successfully');
  }

    /**
   * Perform complete login with valid credentials from users.json
   */
    async verifyDashboardPage(): Promise<void> {
      try {
      await this.waitForVisible(LoginPageLocators.dashboardTitle,10000);
      await this.getTextAndCompare(LoginPageLocators.dashboardTitle, 'Welcome to SADAD!');
      await this.takeScreenshot('Login successfully completed');
      this.logger.info('Login successfully completed');
    } catch (error) {
      this.logger.error('Failed to verify dashboard page', error as Error);
      await this.takeScreenshot('login-failed');
      throw error;
    }
  }
}
