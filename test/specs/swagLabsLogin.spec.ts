import { test, expect } from '../../framework/core/BaseTest';
import { SwagLabsPage } from '../pages/SwagLabsPage';
import swagData from '../data/swagLabs.json';

test.describe('Swag Labs Login', () => {
  let swagPage: SwagLabsPage;

  test.beforeEach(({ page }, testInfo) => {
    swagPage = new SwagLabsPage(page, swagData.url, testInfo);
  });

  test('should login and see inventory', async ({ logger }) => {
    await logger.step('Open Swag Labs', async () => {
      await swagPage.open();
    });

    await logger.step('Login with standard user', async () => {
      await swagPage.login(swagData.credentials.standard_user, swagData.credentials.password_user);
    });

    await logger.step('Wait for inventory to be visible', async () => {
      await swagPage.waitForInventoryVisible();
    });

    await logger.step(`Verify header text Swag Labs = ${swagData.expected.headerText}`, async () => {
      const headerText = await swagPage.getHeaderText();
      expect(headerText).toContain(swagData.expected.headerText);
    });


    await logger.step(`Verify inventory contains $29.99 = ${swagData.expected.priceContains}`, async () => {
      const inventoryText = await swagPage.getInventoryListText();
      expect(inventoryText).toContain(swagData.expected.priceContains);
    });

  });
});
test.describe('Swag Labs Login', () => {
  let swagPage: SwagLabsPage;

  test.beforeEach(({ page }, testInfo) => {
    swagPage = new SwagLabsPage(page, swagData.url, testInfo);
  });

  test('should login and see inventory 1', async ({ logger }) => {
    await logger.step('Open Swag Labs', async () => {
      await swagPage.open();
    });

    await logger.step('Login with standard user', async () => {
      await swagPage.login(swagData.credentials.standard_user, swagData.credentials.password_user);
    });

    await logger.step('Wait for inventory to be visible', async () => {
      await swagPage.waitForInventoryVisible();
    });

    const headerText = await swagPage.getHeaderText();
    expect(headerText).toContain(swagData.expected.headerText);

    const inventoryText = await swagPage.getInventoryListText();
    expect(inventoryText).toContain(swagData.expected.priceContains);
  });
});

test.describe('Swag Labs Login', () => {
  let swagPage: SwagLabsPage;

  test.beforeEach(({ page }, testInfo) => {
    swagPage = new SwagLabsPage(page, swagData.url, testInfo);
  });

  test('should login and see inventory 2', async ({ logger }) => {
    await logger.step('Open Swag Labs', async () => {
      await swagPage.open();
    });

    await logger.step('Login with standard user', async () => {
      await swagPage.login(swagData.credentials.standard_user, swagData.credentials.password_user);
    });

    await logger.step('Wait for inventory to be visible', async () => {
      await swagPage.waitForInventoryVisible();
    });

    const headerText = await swagPage.getHeaderText();
    expect(headerText).toContain(swagData.expected.headerText);

    const inventoryText = await swagPage.getInventoryListText();
    expect(inventoryText).toContain(swagData.expected.priceContains);
  });
});
test.describe('Swag Labs Login', () => {
  let swagPage: SwagLabsPage;

  test.beforeEach(({ page }, testInfo) => {
    swagPage = new SwagLabsPage(page, swagData.url, testInfo);
  });

  test('should login and see inventory 4', async ({ logger }) => {
    await logger.step('Open Swag Labs', async () => {
      await swagPage.open();
    });

    await logger.step('Login with standard user', async () => {
      await swagPage.login(swagData.credentials.standard_user, swagData.credentials.password_user);
    });

    await logger.step('Wait for inventory to be visible', async () => {
      await swagPage.waitForInventoryVisible();
    });

    const headerText = await swagPage.getHeaderText();
    expect(headerText).toContain(swagData.expected.headerText);

    const inventoryText = await swagPage.getInventoryListText();
    expect(inventoryText).toContain(swagData.expected.priceContains);
  });
});
