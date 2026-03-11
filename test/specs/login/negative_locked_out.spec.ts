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

  test('Login with locked out user', async ({ logger }) => {
    await logger.step('Attempt login with locked_out_user credentials', async () => {
      await swagPage.login('locked_out_user', swagData.credentials.locked_out_user);
    });

    await logger.step('Verify error message for locked out user', async () => {
      await swagPage.verifyErrorMessage(swagData.expected.lockedOut);
    });
  });
});
