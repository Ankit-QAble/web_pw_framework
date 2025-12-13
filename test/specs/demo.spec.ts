import { test, expect } from '../../framework/core/BaseTest';
import { DemoPage } from '../pages/DemoPage';
import AxeBuilder from '@axe-core/playwright';

const ORANGE_HRM_URL =
  process.env.ORANGE_HRM_URL ??
  'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

test.describe('OrangeHRM Demo Suite', () => {
  let demoPage: DemoPage;

  test.beforeEach(async ({ page, context, logger }, testInfo) => {
    demoPage = new DemoPage(page, ORANGE_HRM_URL, testInfo);
    
    // Setup actions
    await demoPage.clearBrowserData();
    await demoPage.setViewportSize(1440, 900);

    await logger.step('Open OrangeHRM login page', async () => {
      await demoPage.open();
      const readyState = await demoPage.executeScript('return document.readyState;');
      logger.assertion('Document readyState should be complete', 'complete', readyState);
      expect(readyState).toBe('complete');
      const credentials = demoPage.getValidCredentials();

      await logger.step('Login with valid credentials', async () => {
        await demoPage.loginWith(credentials);
      });
    });
  });

  test.afterEach(async ({ logger }) => {
    if (demoPage) {
      await logger.step('Teardown OrangeHRM context', async () => {
        await demoPage.takeScreenshot('orangehrm-post-test');
      });
    }
  });

  test('should login successfully and reach dashboard', async ({ logger }) => {
    await logger.step('Verify dashboard is visible', async () => {
      await demoPage.verifyDashboardLoaded();
      const pageTitle = await demoPage.getTitle();
      expect(pageTitle).toContain('OrangeHRM');

      const urlPath = await demoPage.executeScript('return window.location.pathname;');
      logger.assertion('URL path should contain dashboard', '/web/index.php/dashboard/index', urlPath);
      expect(String(urlPath)).toContain('/web/index.php/dashboard/index');
    });

    await logger.step('Validate user menu interactions', async () => {
      await demoPage.openUserMenu();
      expect(await demoPage.isLogoutOptionVisible()).toBeTruthy();
      await demoPage.wait(300);
    });
  });
  test('should login successfully and reach dashboard_1', async ({ logger }) => {
    console.log('Azure testing');
  });
});

test.describe('Accessibility', () => {
  test.skip('OrangeHRM login page should not have detectable accessibility issues', async ({ page }) => {
    await page.goto(ORANGE_HRM_URL);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
