import { test as base, Page, BrowserContext } from '@playwright/test';
import { Logger } from '../utils/Logger';
import { ScreenshotHelper } from '../utils/ScreenshotHelper';

export interface TestFixtures {
  logger: Logger;
  screenshotHelper: ScreenshotHelper;
}

export const test = base.extend<TestFixtures>({
  logger: async ({}, use, testInfo) => {
    const logger = new Logger(testInfo.title);
    logger.info(`Starting test: ${testInfo.title}`);
    await use(logger);
    logger.info(`Test completed: ${testInfo.title}`);
  },

  screenshotHelper: async ({ page }, use, testInfo) => {
    const screenshotHelper = new ScreenshotHelper(page, testInfo);
    await use(screenshotHelper);
  },
});

export { expect } from '@playwright/test';
