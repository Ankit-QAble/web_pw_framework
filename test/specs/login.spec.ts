import { test, expect } from '../../framework/core/BaseTest';
import { LoginPage } from '../pages/LoginPage';
import { envConfig } from '../../framework/utils/EnvConfig';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const users = require('../data/users.json');

// Real application URL and test data from environment config
const LOGIN_URL = envConfig.getBaseUrl();
const TEST_CREDENTIALS = {
  // Map username to the mobileNumber field expected by LoginPage methods
  mobileNumber: users.validUsers[0].username,
  password: users.validUsers[0].password,
  otp: users.validUsers[0].otp
};

test.describe('Login Page Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }, testInfo) => {
    loginPage = new LoginPage(page, LOGIN_URL, testInfo);
    await loginPage.navigateToLogin();
  });
  
  test('Enter valid credentials @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
    await logger.step('Enter valid credentials', async () => {
      await loginPage.login(TEST_CREDENTIALS);
    });

  
    await logger.step('Verify page loads and elements are visible', async () => {
      await loginPage.verifyLoginPageElements();
    });

    await logger.step('Take screenshot of login page', async () => {
      await loginPage.takeScreenshot('login-page-loaded', 10);
    });
  });

  // test('#2 Enter valid credentials', { tag: ['@smoke'] }, async ({ logger }) => {
  //   await logger.step('Enter valid credentials', async () => {
  //     await loginPage.login(TEST_CREDENTIALS);
  //   });
  // });

  // test('#3 Enter valid credentials', { tag: ['@smoke'] }, async ({ logger }) => {
  //   await logger.step('Enter valid credentials', async () => {
  //     await loginPage.login(TEST_CREDENTIALS);
  //   });
  // });

  // test('#4 Enter valid credentials', { tag: ['@smoke'] }, async ({ logger }) => {
  //   await logger.step('Enter valid credentials', async () => {
  //     await loginPage.login(TEST_CREDENTIALS);
  //   });
  // });

  // test('#5 Enter valid credentials', { tag: ['@smoke'] }, async ({ logger }) => {
  //   await logger.step('Enter valid credentials', async () => {
  //     await loginPage.login(TEST_CREDENTIALS);
  //   });
  // });

  // test('#6 Enter valid credentials', { tag: ['@smoke'] }, async ({ logger }) => {
  //   await logger.step('Enter valid credentials', async () => {
  //     await loginPage.login(TEST_CREDENTIALS);
  //   });
  // });

  test('#7 Enter valid credentials', { tag: ['@critical'] }, async ({ logger }) => {
    await logger.step('Enter valid credentials', async () => {
      await loginPage.login(TEST_CREDENTIALS);
    });

    await logger.step('Verify page loads and elements are visible', async () => {
      await loginPage.verifyLoginPageElements();
    });
    await logger.step('Verify OTP page loads and elements are visible', async () => {
      await loginPage.verifyEnterOTPPage();
    });
    await logger.step('Enter 6 digit OTP and verify', async () => {
      await loginPage.enterOTP();
    });
    await logger.step('Take screenshot of login page', async () => {
      await loginPage.takeScreenshot('login-page-loaded', 10);
    });

  }); 
});