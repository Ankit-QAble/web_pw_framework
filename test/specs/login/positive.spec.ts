// spec: test/login.test.plan.md
// seed: test/specs/seed.spec.ts

import { test, expect } from '../../../framework/core/BaseTest';
import { SwagLabsPage } from '../../pages/SwagLabsPage';
import swagData from '../../data/swagLabs.json';

test.describe('Login Scenarios', () => {
  let swagPage: SwagLabsPage;

  test.beforeEach(async ({ page }, testInfo) => {
    swagPage = new SwagLabsPage(page, swagData.url, testInfo);
    await swagPage.open();
    await swagPage.verifyLoginPageDisplayed();
  });

  test('Successful login with valid credentials', async ({ logger }) => {
    await logger.step('Login with standard_user credentials', async () => {
      await swagPage.login('standard_user', swagData.credentials.standard_user);
    });

    await logger.step('Verify user is redirected to inventory page', async () => {
      await swagPage.verifyInventoryPageLoaded();
    });
  });
});
