import { test, expect } from '../../../framework/core/BaseTest';
import { SwagLabsPage } from '../../pages/SwagLabsPage';
import swagData from '../../data/swagLabs.json';

test.describe('Add To Cart', () => {
  let swagPage: SwagLabsPage;

  test.beforeEach(async ({ page }, testInfo) => {
    swagPage = new SwagLabsPage(page, swagData.url, testInfo);
    await swagPage.open();
    await swagPage.verifyLoginPageDisplayed();
  });

  test('Add items and complete checkout @smoke', async ({ logger }) => {
    await logger.step('Login with standard_user', async () => {
      await swagPage.login(swagData.credentials.standard_user, swagData.credentials.password_user);
      await swagPage.waitForInventoryVisible();
    });

    await logger.step('Add Backpack and Bike Light to cart', async () => {
      await swagPage.addBackpackToCart();
      await swagPage.addBikeLightToCart();
    });

    await logger.step('Verify Backpack shows Remove button', async () => {
      const removeText = await swagPage.getRemoveBackpackText();
      expect(removeText).toContain('Remove');
    });

    await logger.step('Open cart and verify prices listed', async () => {
      await swagPage.openCart();
      const cartText = await swagPage.getCartListText();
      expect(cartText).toContain('$9.99');
      expect(cartText).toContain('$29.99');
      await swagPage.expectCartActionsVisible();
    });

    await logger.step('Proceed to checkout and fill information', async () => {
      await swagPage.goToCheckout();
      const title = await swagPage.getCheckoutTitle();
      expect(title).toContain('Checkout: Your Information');
      await swagPage.fillCheckoutInformation('Ankit', 'Patel', '38005');
      await swagPage.continueCheckout();
    });

    await logger.step('Verify totals before finishing', async () => {
      const total = await swagPage.getTotalLabel();
      const subtotal = await swagPage.getSubtotalLabel();
      const tax = await swagPage.getTaxLabel();
      expect(total).toContain('Total: $43.18');
      expect(subtotal).toContain('Item total: $39.98');
      expect(tax).toContain('Tax: $3.20');
      await swagPage.expectFinishVisible();
    });

    await logger.step('Finish order and verify completion', async () => {
      await swagPage.finishCheckout();
      const header = await swagPage.getCompleteHeader();
      expect(header).toContain('Thank you for your order!');
      await expect(swagPage.completeContainer()).toMatchAriaSnapshot(`
        - img "Pony Express"
        - heading "Thank you for your order!" [level=2]
        - text: Your order has been dispatched, and will arrive just as fast as the pony can get there!
        - button "Back Home"
      `);
    });
  });
});
