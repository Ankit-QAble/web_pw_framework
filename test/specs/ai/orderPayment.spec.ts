import { test } from '../../../framework/core/BaseTest';
import { orderPaymentPage as orderPayment } from '../../pages/ai/orderPaymentPage';
import { AddToCardAugmontPage as AddToCart } from '../../pages/ai/AddToCardAugmontPage';
import { AddToCardAugmontLocators as cartLocators } from '../../locators/ai/AddToCardAugmontLocators';
import augmontData from '../../data/augmontData.json';

test.describe('Order payment Tests', () => {
  test('Verify Payment Success and Order Visible in My Orders', async ({ page, logger }, testInfo) => {
    const flow = new orderPayment(page, cartLocators.loginUrl, testInfo);
    const addToCartFlow = new AddToCart(page, cartLocators.loginUrl, testInfo);

    await logger.step('Go to Augmont website and login', async () => {
      await addToCartFlow.open();
      await addToCartFlow.login(augmontData.AugData.username, augmontData.AugData.password);
    });

    await logger.step('Go to My order', async () => {
      await flow.openUserMenu();
      await flow.openMyOrder();
    });

    await logger.step('Click on pending order', async () => {
      await flow.clickOnPendoing();
    });
    
    await logger.step(`Verify total price matches order price ${flow.orderPrice}`, async () => {
      await flow.verifySubTotal();
    });

    await logger.step('Select card payment option', async () => {
      await flow.selectCardPayment();
    });

    await logger.step('Enter card details', async () => {
      await flow.enterCardDetails();
    });

    await logger.step('Verify payment success', async () => {
      await flow.verifyPaymentSuccess();
    });

    await logger.step(`Verify paid amount matches order price ${flow.inrPrice}`, async () => {
      await flow.verifyPaidAmount();
    });

  });
});
