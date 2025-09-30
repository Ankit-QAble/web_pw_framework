import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';
import { LoginPageLocators } from '../locators/LoginPageLocators';

export interface LoginCredentials {
  mobileNumber: string;
  password: string;
  otp: string;
}

export class LoginPage extends BasePage {
  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    // Use the URL from config or fallback to the provided URL
    const defaultUrl = process.env.BASE_URL || 'https://aks-panel.sadad.qa/auth/login';
    super(page, url || defaultUrl, testInfo);
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin(): Promise<void> {
    try {
      this.logger.info(`Navigating to: ${this.url}`);
      
      // Check if page is still open before navigation
      if (this.page.isClosed()) {
        throw new Error('Page is already closed before navigation');
      }
      
      await this.navigate();
      
      // Add extra wait for CI stability with longer timeout
      if (process.env.CI) {
        this.logger.info('CI environment detected - using extended timeout');
        try {
          // Check if page is still open before waiting for network idle
          if (this.page.isClosed()) {
            throw new Error('Page was closed during navigation');
          }
          
          await this.page.waitForLoadState('networkidle', { timeout: 60000 });
          this.logger.info('Network idle achieved');
        } catch (networkError) {
          this.logger.warn('Network idle timeout - checking if page is still functional');
          
          // Check if page is still accessible
          if (this.page.isClosed()) {
            this.logger.error('Page was closed during network idle wait');
            throw new Error('Page was closed during network idle wait');
          }
          
          try {
            const currentUrl = this.page.url();
            const pageTitle = await this.page.title();
            this.logger.info(`Current URL: ${currentUrl}`);
            this.logger.info(`Page title: ${pageTitle}`);
            
            // If we can get the title, the page is likely loaded
            if (pageTitle && pageTitle !== '') {
              this.logger.info('Page appears to be loaded despite network idle timeout');
            } else {
              throw networkError;
            }
          } catch (pageCheckError) {
            this.logger.error('Page check failed after network idle timeout', pageCheckError as Error);
            const errorMessage = pageCheckError instanceof Error ? pageCheckError.message : String(pageCheckError);
            throw new Error(`Page became inaccessible: ${errorMessage}`);
          }
        }
      }
    } catch (error) {
      this.logger.error('Failed to navigate to login page', error as Error);
      
      // Only take screenshot if page is still open
      if (!this.page.isClosed()) {
        try {
          await this.takeScreenshot('navigation-failed');
        } catch (screenshotError) {
          this.logger.warn('Could not take screenshot - page may be closed', screenshotError as Error);
        }
      } else {
        this.logger.warn('Cannot take screenshot - page is closed');
      }
      
      throw error;
    }
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
    
    try {
      // Check if page is still accessible
      if (this.page.isClosed()) {
        throw new Error('Page has been closed');
      }
      
      await this.waitForPageLoad();
      
      // Firefox-specific handling for element detection
      const browserName = this.page.context().browser()?.browserType().name();
      this.logger.info(`Browser detected: ${browserName}`);
      
      // Try to find the page title with extended timeout for Firefox
      const titleTimeout = browserName === 'firefox' ? 120000 : 90000;
      try {
        await this.waitUntilElementPresent(LoginPageLocators.pageTitle, titleTimeout);
      } catch (titleError) {
        this.logger.warn('Page title not found, checking page state...');
        
        // Check if page is still open
        if (this.page.isClosed()) {
          throw new Error('Page was closed during title wait');
        }
        
        // Get current page info for debugging
        const currentUrl = this.page.url();
        const pageTitle = await this.page.title();
        this.logger.info(`Current URL: ${currentUrl}`);
        this.logger.info(`Page title: ${pageTitle}`);
        
        // Check if we're on the right page
        if (!currentUrl.includes('login') && !currentUrl.includes('auth')) {
          throw new Error(`Not on login page. Current URL: ${currentUrl}`);
        }
        
        // Try alternative selectors for Firefox
        const alternativeSelectors = [
          'h2',
          '[class*="title"]',
          '[class*="heading"]',
          'h1'
        ];
        
        let foundElement = false;
        for (const selector of alternativeSelectors) {
          try {
            const count = await this.page.locator(selector).count();
            if (count > 0) {
              const text = await this.page.locator(selector).first().textContent();
              this.logger.info(`Found alternative element: ${selector} with text: ${text}`);
              foundElement = true;
              break;
            }
          } catch (altError) {
            // Continue to next selector
          }
        }
        
        if (!foundElement) {
          throw new Error(`No login elements found. Page may not have loaded properly. URL: ${currentUrl}, Title: ${pageTitle}`);
        }
      }
      
      await this.getTextAndCompare(LoginPageLocators.pageTitle, 'Login in to SADAD');
      await this.enterMobileNumber(credentials.mobileNumber);
      await this.enterPassword(credentials.password);
      
      // Increase timeout for CI environments
      const clickTimeout = process.env.CI ? 10000 : 6000;
      await this.waitUntilElementClickable(LoginPageLocators.loginButton, clickTimeout);
      await this.clickLoginButton();
      
      this.logger.info('Login attempt completed');
    } catch (error) {
      this.logger.error('Login failed', error as Error);
      
      // Only take screenshot if page is still open
      if (!this.page.isClosed()) {
        try {
          await this.takeScreenshot('login-failed');
        } catch (screenshotError) {
          this.logger.warn('Could not take screenshot - page may be closed', screenshotError as Error);
        }
      } else {
        this.logger.warn('Cannot take screenshot - page is closed');
      }
      
      throw error;
    }
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
  async enterOTP(): Promise<void> {
    this.logger.info('Enter OTP');
    const otpValue = "333333";
    
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
}