import { test, expect, BaseTest } from '../../framework/core/BaseTest';
import { DemoPage } from '../pages/DemoPage';
import AxeBuilder from '@axe-core/playwright';

const ORANGE_HRM_URL =
  process.env.ORANGE_HRM_URL ??
  'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

class OrangeHrmTest extends BaseTest {
  override async setup(): Promise<void> {
    await super.setup();
    await this.clearBrowserData();
    await this.setViewportSize(1440, 900);
  }

  override async teardown(): Promise<void> {
    await this.takeScreenshot('orangehrm-post-test');
    await super.teardown();
  }
}

test.describe('OrangeHRM Demo Suite', () => {
  let demoPage: DemoPage;
  let baseTestContext: OrangeHrmTest;

  test.beforeEach(async ({ page, context, logger }, testInfo) => {
    baseTestContext = new OrangeHrmTest(page, context, logger);
    await baseTestContext.setup();

    demoPage = new DemoPage(page, ORANGE_HRM_URL, testInfo);

    await logger.step('Open OrangeHRM login page', async () => {
      await demoPage.open();
      const readyState = await baseTestContext.executeScript('return document.readyState;');
      logger.assertion('Document readyState should be complete', 'complete', readyState);
      expect(readyState).toBe('complete');
      const credentials = demoPage.getValidCredentials();

      await logger.step('Login with valid credentials', async () => {
        await demoPage.loginWith(credentials);
      });
    });
  });

  test.afterEach(async ({ logger }) => {
    if (baseTestContext) {
      await logger.step('Teardown OrangeHRM context', async () => {
        await baseTestContext.teardown();
      });
    }
  });

  test('should login successfully and reach dashboard', async ({ logger }) => {
    await logger.step('Verify dashboard is visible', async () => {
      await demoPage.verifyDashboardLoaded();
      const pageTitle = await baseTestContext.getPageTitle();
      expect(pageTitle).toContain('OrangeHRM');

      const urlPath = await baseTestContext.executeScript('return window.location.pathname;');
      logger.assertion('URL path should contain dashboard', '/web/index.php/dashboard/index', urlPath);
      expect(String(urlPath)).toContain('/web/index.php/dashboard/index');
    });

    await logger.step('Validate user menu interactions', async () => {
      await demoPage.openUserMenu();
      expect(await demoPage.isLogoutOptionVisible()).toBeTruthy();
      await baseTestContext.pressEscape();
      await baseTestContext.wait(300);
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
