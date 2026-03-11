// spec: test/login.test.plan.md
// seed: test/specs/seed.spec.ts

import { test } from '../../../framework/core/BaseTest';
import { SwagLabsPage } from '../../pages/SwagLabsPage';
import swagData from '../../data/swagLabs.json';

test.describe('Login Scenarios - Negative', () => {
  let swagPage: SwagLabsPage;

  test.beforeEach(async ({ page }, testInfo) => {
    swagPage = new SwagLabsPage(page, swagData.url, testInfo);
    await swagPage.open();
    await swagPage.verifyLoginPageDisplayed();
  });

  test('Login with invalid password', async ({ logger }) => {
    await logger.step('Attempt login with valid username and incorrect password', async () => {
      await swagPage.loginWithInvalidCredentials(swagData.credentials.standard_user, 'wrong_password');
    });

    await logger.step('Verify error message for invalid credentials', async () => {
      await swagPage.verifyErrorMessage(swagData.expected.invalidCredentials);
    });
  });
});
