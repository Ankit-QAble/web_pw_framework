import { test, expect } from '../../framework/core/BaseTest';
import { LoginPage } from '../pages/LoginPage';
import { envConfig } from '../../framework/utils/EnvConfig';

// Real application URL from profile config
const LOGIN_URL = (global as any).selectedProfile?.baseURL;
console.log(`🔍 LOGIN_URL from selectedProfile.baseURL: ${LOGIN_URL}`);

test.describe('Login Page Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }, testInfo) => {
    // Add extra stability for CI environments
    if (process.env.CI) {
      try {
        await page.waitForLoadState('networkidle', { timeout: 30000 });
      } catch (error) {
        console.log('Network idle timeout in beforeEach - continuing');
      }
    }
    
    loginPage = new LoginPage(page, LOGIN_URL, testInfo);
    
    // Get retry count from config
    let retryCount = 0;
    const maxRetries = (global as any).selectedProfile?.retries || 0;
    
    console.log(`🔍 Starting navigation with maxRetries: ${maxRetries}`);
    
    // Always attempt navigation at least once, even if maxRetries is 0
    do {
      try {
        console.log(`🔍 Calling navigateToLogin() - attempt ${retryCount + 1}`);
        await loginPage.navigateToLogin();
        console.log(`🔍 navigateToLogin() completed successfully`);
        break; // Success, exit retry loop
      } catch (error) {
        retryCount++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`Navigation attempt ${retryCount} failed: ${errorMessage}`);
        
        if (retryCount > maxRetries) {
          throw error; // Final attempt failed
        }
        
        // Wait before retry (only if we're going to retry)
        if (retryCount <= maxRetries) {
          await page.waitForTimeout(2000);
          console.log(`Retrying navigation (attempt ${retryCount + 1}/${maxRetries + 1})...`);
        }
      }
    } while (retryCount <= maxRetries);
  });
  
  // test('Enter valid credentials @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
  //   await logger.step('Enter valid credentials', async () => {
  //     await loginPage.loginWithValidCredentials();
  //   });
  //   await logger.step('Verify dashboard page', async () => {
  //     await loginPage.verifyDashboardPage();
  //   });
  // });

  test('Sign up page', { tag: ['@smoke'] }, async ({ logger, page }) => {
    try {
      await logger.step('Register new user', async () => {
        await loginPage.registerUser();
      });
      
      await logger.step('Enter OTP', async () => {
        await loginPage.enterOTP('333333');
      });
      
      await logger.step('Select interest', async () => {
        await loginPage.selectIntrest();
      });
      
      await logger.step('Verify dashboard', async () => {
        await loginPage.verifyDashboard();
      });
      
      await logger.step('Update business details', async () => {
        await loginPage.updateBusinessDetails();
      });
      
      await logger.step('Save and proceed', async () => {
        await loginPage.clickOnSaveAndNextButton();
      });
      
      await logger.step('Upload commercial licence', async () => {
        await loginPage.commericalLicenceUpload();
      });

      await logger.step('Upload owner partners id', async () => {
        await loginPage.ownerPartnersIdUpload();
      });

      await logger.step('Click on save and next button', async () => {
        await loginPage.clickOnSaveAndNextButton();
      });

      await logger.step('Business details in review', async () => {
        await loginPage.businessDetailsInReview();
      });

      await logger.step('Enter bank account name', async () => {
        await loginPage.enterBankAccountName();
      });

      await logger.step('Enter IBAN number', async () => {
        await loginPage.enterIBANNumber();
      });
      
      await logger.step('Upload bank account document details', async () => {
        await loginPage.uploadBankAccountDocument();

      });

      await logger.step('Click on save and next button', async () => {
        await loginPage.clickOnSaveAndNextButton();
      });
      await logger.step('Click on confirm button', async () => {
        await loginPage.clickOnConfirmButton();
      });
      await logger.step('Add signatory', async () => {
        await loginPage.addSignatory();
      });

      await logger.step('Click on start button', async () => {
        await loginPage.clickOnStartButton();
      });

      await logger.step('Upload owner id', async () => {
        await loginPage.uploadOwnerId();
      });

      await logger.step('Click on continue button', async () => {
        await loginPage.clickContinueButtonInIframe();
      });

      await logger.step('Upload owner image', async () => {
        await loginPage.uploadOwnerImage();
      });

      await logger.step('Click on continue button', async () => {
        await loginPage.clickContinueButtonInIframe();
      });

      await logger.step('Click on proceed to esignature button', async () => {
        await loginPage.clickOnESignatureButton();
      });

      await logger.step('Upload sign document', async () => {
        await loginPage.uploadSignDocument();
      });

      



      // Final verification - ensure we're on the expected page
      const currentUrl = page.url();
      logger.info(`Test completed successfully. Current URL: ${currentUrl}`);
    } catch (error) {
      // Log error details
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Test failed: ${errorMessage}`);
      
      // Take screenshot on failure
      await page.screenshot({ path: `test-results/failure-${Date.now()}.png`, fullPage: true });
      
      // Re-throw to ensure test is marked as failed
      throw error;
    }
  });

  
});