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

  test('Login with empty username', async ({ logger }) => {
    await logger.step('Attempt login with empty username and valid password', async () => {
      await swagPage.loginWithEmptyUsername(swagData.credentials.standard_user);
    });

    await logger.step('Verify error message for missing username', async () => {
      await swagPage.verifyErrorMessage(swagData.expected.usernameRequired);
    });
  });
});
