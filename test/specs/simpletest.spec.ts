import { SimplePage } from '../pages/simplePage';
import { test, expect } from '../../framework/core/BaseTest';



test.describe('Simple Test Suite @smoke', () => {
  test('google test', { tag: ['@smoke'] }, async ({logger, page }, testInfo) => {
    const simplePage = new SimplePage(page, undefined, testInfo);
    
    // Start capturing console logs and network requests
    await logger.step('Start capturing console logs and network requests', async () => {
      await simplePage.startCapturingConsoleLogs();
      await simplePage.startCapturingNetworkRequests();
    });
    
    await logger.step('Open the page', async () => {
      await simplePage.open();
    });
    
    await logger.step('Interact with search', async () => {
        await simplePage.googleClick();
        await simplePage.googleSearch();
      });
    
    // Save captured data to files in log folder
    await logger.step('Save captured data to files', async () => {
      const files = await simplePage.saveAllCapturedData();
      logger.info(`Console logs saved to: ${files.consoleLogs}`);
      logger.info(`Console errors saved to: ${files.consoleErrors}`);
      logger.info(`Network requests saved to: ${files.networkRequests}`);
      logger.info(`Failed network requests saved to: ${files.failedRequests}`);
    });
  });
});

test.describe('Simple Test Suite Two @regression', () => {
  test('google test two', async ({logger, page }, testInfo) => {
    const simplePage = new SimplePage(page, undefined, testInfo);
    
    await logger.step('Open the page', async () => {
      await simplePage.open();
    });
    
    await logger.step('Interact with search', async () => {
      await simplePage.googleClick();
      await simplePage.googleSearch();
      await simplePage.takeScreenshot('google-search-failed');
    });
  });
});

test.describe('Simple Test Suite fail test @regression', () => {
  test('google test two', async ({logger, page }, testInfo) => {
    const simplePage = new SimplePage(page, undefined, testInfo);
    
    await logger.step('Open the page', async () => {
      await simplePage.open();
    });
    
    await logger.step('Interact with search', async () => {
      await simplePage.googleClickFail();
      await simplePage.googleSearch();
      await simplePage.takeScreenshot('google-search-failed');
    });
  });
});
test.describe('Annotation test @Annotation', () => {
  test('skip this test', async ({ logger, page }, testInfo) => {
    test.skip();

    const simplePage = new SimplePage(page, undefined, testInfo);
    
    await logger.step('Open the page', async () => {
      await simplePage.open();
    });
  });

  test('expected to fail test', async ({ logger, page }, testInfo) => {
    test.fail();

    const simplePage = new SimplePage(page, undefined, testInfo);
    
    await logger.step('Open the page', async () => {
      await simplePage.open();
    });
  });

  // You can declare a test as to be fixed, and Playwright will not run it.
  test('fixme test', async ({ logger, page }, testInfo) => {
    test.fixme();

    const simplePage = new SimplePage(page, undefined, testInfo);
    
    await logger.step('Open the page', async () => {
      await simplePage.open();
    });
  });
});
