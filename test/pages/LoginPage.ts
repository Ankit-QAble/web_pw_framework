import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';
import { LoginPageLocators } from '../locators/LoginPageLocators';
import { testData } from '../../framework/utils/DataHelper';
import { faker } from '@faker-js/faker';

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
  async clickOnRegisterButton(): Promise<void> {
    await this.click(LoginPageLocators.loginButton);
    this.logger.info('Login button clicked');
  }

  async registerUser(): Promise<void> {
    const mobileNumber = faker.string.numeric(8);
    const emailCount = faker.string.numeric(3);
    await this.maximizeScreen(1500, 1024);
    await this.click(LoginPageLocators.registerButton);
    await this.fill(LoginPageLocators.businessEmailfield, `ankit.patel${emailCount}@sadad.qa`);
    this.logger.info(`ankit.patel${emailCount}@sadad.qa`);
    await this.fill(LoginPageLocators.mobileNumberfield, mobileNumber);
    await this.fill(LoginPageLocators.passwordFieldBox, 'QAble@2020');
    await this.fill(LoginPageLocators.confirmPasswordField, 'QAble@2020');
    await this.click(LoginPageLocators.getStartedButton);
    await this.waitForTimeout(10000);
    this.logger.info('Register button clicked');
    await this.waitForTimeout(10000);
  }
  async selectIntrest(): Promise<void> {
    await this.click(LoginPageLocators.sadadInvoice);
    await this.click(LoginPageLocators.createAccountButton);
    this.logger.info('Intrest selected');
  }

  async verifyDashboard(): Promise<void> {
    await this.waitForVisible(LoginPageLocators.dashboardTitle,20000);
    await this.getTextAndCompare(LoginPageLocators.dashboardTitle, 'Welcome to SADAD!');
    await this.takeScreenshot('Sign up successfully completed');
    this.logger.info('Sign up successfully completed');
  }

  async updateBusinessDetails(): Promise<void> {
    await this.click(LoginPageLocators.completeNowButton);
    await this.waitForVisible(LoginPageLocators.businessLegalName,20000);
    await this.fill(LoginPageLocators.businessLegalName, 'Test Business');
    await this.click(LoginPageLocators.businessLegalForm);
    await this.waitForTimeout(5000);
    await this.click(LoginPageLocators.BusinessHome);
    await this.waitForTimeout(5000);
    await this.waitForVisible(LoginPageLocators.ownerPartnersId,10000);
    await this.waitForVisible(LoginPageLocators.commercialLicene,10000); 
    await this.click(LoginPageLocators.confirmBusinessLegalFormButton);
    await this.waitForTimeout(5000);
    await this.click(LoginPageLocators.businessCategory);
    await this.waitForTimeout(5000);
    await this.click(LoginPageLocators.smallScaleBusiness);
    await this.waitForTimeout(5000);
    await this.click(LoginPageLocators.confirmCategoryButton);
    await this.waitForTimeout(5000);
    await this.fill(LoginPageLocators.businessLegalName, 'Test Business');
  }
  async clickOnSaveAndNextButton(): Promise<void> {
    await this.click(LoginPageLocators.saveAndNextButton);
    this.logger.info('Save and next button clicked');
  }
  async businessDetailsInReview(): Promise<void> {
    await this.getTextAndCompare(LoginPageLocators.businessDetailsInReview, ' Review ');
    this.logger.info('Save and next button clicked');
  }

  async commericalLicenceUpload(): Promise<void> {
    try {
      // Upload CL Document - uploadFileViaButton will click the button and handle file dialog
      this.logger.info('Starting commercial licence upload process');
      await this.waitForTimeout(10000);
      
      await this.uploadFileViaButton(
        LoginPageLocators.CLFileUploadButton, 
        'E:/Project/web_pw_framework/cl_document.pdf'
      );
      this.logger.info('File uploaded successfully, waiting for verification');
      
      await this.waitForTimeout(60000);
      
      // Wait for verified text with longer timeout
      this.logger.info('Waiting for verified text to appear');
      await this.waitForVisible(LoginPageLocators.verifiedText, 60000);
      this.logger.info('Verified text found');
      
      await this.click(LoginPageLocators.closeButton);
      this.logger.info('Close button clicked');
    
      this.logger.info('Commercial licence uploaded successfully');
      await this.takeScreenshot('commercial-licence-uploaded-successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Commercial licence upload failed: ${errorMessage}`);
      await this.takeScreenshot('commercial-licence-upload-failed');
      throw new Error(`Commercial licence upload failed: ${errorMessage}`);
    }
  }
  async ownerPartnersIdUpload(): Promise<void> {
    try {
      // Upload CL Document - uploadFileViaButton will click the button and handle file dialog
      this.logger.info('Starting owner partners id upload process');
      await this.waitForTimeout(10000);
      
      await this.uploadFileViaButton(
        LoginPageLocators.ownerIDUploadButton, 
        'E:/Project/web_pw_framework/Mr_Abdulla_Id.jpg'
      );
      this.logger.info('File uploaded successfully, waiting for verification');
      
      await this.waitForTimeout(90000);
      
      // Wait for verified text with longer timeout
      this.logger.info('Waiting for verified text to appear');
      await this.waitForVisible(LoginPageLocators.verifiedText, 60000);
      this.logger.info('Verified text found');
      
      await this.click(LoginPageLocators.closeButton);
      this.logger.info('Close button clicked');
    
      this.logger.info('Owner ID uploaded successfully');
      await this.takeScreenshot('Owner-ID-uploaded-successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Owner ID upload failed: ${errorMessage}`);
      await this.takeScreenshot('Owner-ID-upload-failed');
      throw new Error(`Owner ID upload failed: ${errorMessage}`);
    }
  }
  async enterBankAccountName(): Promise<void> {
    await this.fill(LoginPageLocators.bankAccountName, 'KHALED PMAR HAZZAM');
    this.logger.info('Bank account name entered');
  }
  async enterIBANNumber(): Promise<void> {
    const accountNumber = faker.string.numeric(10);
    await this.fill(LoginPageLocators.enterIBANNumber, `QA58DOHB1234ABCD567${accountNumber}`);
    this.logger.info('IBAN number entered');
  }


  async uploadBankAccountDocument(): Promise<void> {
    await this.uploadFileViaButton(LoginPageLocators.bankAccountDocument, 
      'E:/Project/web_pw_framework/Bank_account.png');
  }
  async clickOnConfirmButton(): Promise<void> {
    await this.click(LoginPageLocators.confirmButton);
    this.logger.info('Confirm button clicked');
  }

  async addSignatory(): Promise<void> {
    await this.click(LoginPageLocators.addSignatoryButton);
    await this.fill(LoginPageLocators.addSignatoryName, 'QA Automation');
    await this.click(LoginPageLocators.addSignatoryButtonInside);
    await this.waitForTimeout(5000);
    await this.getTextAndCompare(LoginPageLocators.verifySignatoryName, 'QA Automation');
    await this.click(LoginPageLocators.startButton);
    await this.waitForVisible(LoginPageLocators.aggreeCheckBox, 10000);
    await this.click(LoginPageLocators.aggreeCheckBox);
    await this.waitForVisible(LoginPageLocators.agreeButton, 10000);
    await this.click(LoginPageLocators.agreeButton);
    await this.waitForTimeout(5000);  
  }

  async clickOnStartButton(): Promise<void> {
    await this.waitForVisible(LoginPageLocators.startButton, 10000);
    await this.click(LoginPageLocators.startButton);
    this.logger.info('Start button clicked');
  }

  async uploadOwnerId(): Promise<void> {
    try {
      this.logger.info('Starting owner ID upload inside iframe');
      await this.waitForTimeout(30000);
      // Upload file via button click inside iframe
      await this.uploadFileViaButtonInFrame(
        LoginPageLocators.uploadIframe,  // iframe#myIframe
        LoginPageLocators.uploadOwnerId,  // //button[normalize-space()='Upload']
        'E:/Project/web_pw_framework/Mr_Abdulla_Id.jpg',
        15000 // timeout for file chooser
      );
      
      this.logger.info('Owner ID file uploaded successfully inside iframe');
      await this.takeScreenshot('owner-id-uploaded-in-iframe');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to upload owner ID in iframe: ${errorMessage}`);
      await this.takeScreenshot('owner-id-upload-failed-in-iframe');
      throw new Error(`Failed to upload owner ID in iframe: ${errorMessage}`);
    }
  }

  /**
   * Click Continue button inside iframe
   */
  async clickContinueButtonInIframe(): Promise<void> {
    try {
      this.logger.info('Clicking Continue button inside iframe');
      await this.waitForTimeout(60000);
      // Click the Continue button inside the iframe
      await this.clickInFrame(
        LoginPageLocators.uploadIframe,  // iframe#myIframe
        LoginPageLocators.continueButtonInIframe,  // //button[normalize-space()='Continue']
        10000 // timeout
      );
      
      this.logger.info('Continue button clicked successfully in iframe');
      await this.takeScreenshot('continue-button-clicked-in-iframe');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to click Continue button in iframe: ${errorMessage}`);
      await this.takeScreenshot('continue-button-click-failed-in-iframe');
      throw new Error(`Failed to click Continue button in iframe: ${errorMessage}`);
    }
  }
  async uploadOwnerImage(): Promise<void> {
    try {
      this.logger.info('Starting owner image upload inside iframe');
      await this.waitForTimeout(20000);
      // Upload file via button click inside iframe
      await this.uploadFileViaButtonInFrame(
        LoginPageLocators.uploadIframe,  // iframe#myIframe
        LoginPageLocators.uploadOwnerImage,  // //button[normalize-space()='Upload']
        'E:/Project/web_pw_framework/Mr_Abdulla_Image.jpg',
        15000 // timeout for file chooser
      );
      
      this.logger.info('Owner image file uploaded successfully inside iframe');
      await this.takeScreenshot('owner-image-uploaded-in-iframe');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to upload owner image in iframe: ${errorMessage}`);
      await this.takeScreenshot('owner-image-upload-failed-in-iframe');
      throw new Error(`Failed to upload owner image in iframe: ${errorMessage}`);
    }
  }
  async clickOnESignatureButton(): Promise<void> {
    await this.waitForTimeout(20000); // 2 minutes
    await this.waitForVisible(LoginPageLocators.verifySubmission, 60000);
    await this.getTextAndCompare(LoginPageLocators.verifySubmission, 'Video Verification Submitted');
    await this.click(LoginPageLocators.proceedToEsignatureButton);
    this.logger.info('Proceed to Esignature button clicked');
  }
  async uploadSignDocument(): Promise<void> {
    await this.waitForTimeout(20000);
    await this.uploadFileViaButton(LoginPageLocators.uploadSignDocumentButton, 
      'E:/Project/web_pw_framework/Mr_Abdulla_Image.jpg');
    await this.click(LoginPageLocators.TnCButton);
    await this.click(LoginPageLocators.submitButton);
    await this.waitForVisible(LoginPageLocators.verifyESignSubmited, 60000);
    await this.getTextAndCompare(LoginPageLocators.verifyESignSubmited, 'E-Signature Submitted');
    await this.click(LoginPageLocators.doneButton);
    this.logger.info('Done button clicked');
  }

  async verifyOnboardingCompleted(): Promise<void> {
    await this.waitForVisible(LoginPageLocators.onboardingCompleted, 60000);
    await this.getTextAndCompare(LoginPageLocators.onboardingCompleted, 'Your Onboarding is now Completed');
    this.logger.info('Onboarding completed');
    await this.takeScreenshot('Onboarding completed');
  }
}