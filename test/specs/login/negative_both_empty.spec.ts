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

  test('Login with both fields empty', async ({ logger }) => {
    await logger.step('Attempt login with both username and password empty', async () => {
      await swagPage.loginWithBothEmpty();
    });

    await logger.step('Verify error message for missing username', async () => {
      await swagPage.verifyErrorMessage(swagData.expected.usernameRequired);
    });
  });
});
