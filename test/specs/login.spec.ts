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
  
  test('Enter valid credentials @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter valid credentials', async () => {
      await loginPage.loginWithValidCredentials();
    });
    await logger.step('Verify dashboard page', async () => {
      await loginPage.verifyDashboardPage();
    });
  });
});