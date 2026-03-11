import { test } from '../../../framework/core/BaseTest';
import { AddToCardAugmontPage } from '../../pages/ai/AddToCardAugmontPage';
import { AddToCardAugmontLocators as data } from '../../locators/ai/AddToCardAugmontLocators';
import augmontData from '../../data/augmontData.json';

test('AddToCardAugmont', async ({ page, logger }, testInfo) => {
  const flow = new AddToCardAugmontPage(page, data.loginUrl, testInfo);

  await logger.step('Go to Augmont website and login', async () => {
    await flow.open();
    await flow.login(augmontData.AugData.username, augmontData.AugData.password);
  });

  await logger.step(`Search product ${augmontData.AugData.productCode}`, async () => {
    await flow.applyFilters();
    await flow.clearAll();
    await flow.searchCertificate(augmontData.AugData.productCode);
    //await flow.openGrid();
  });

  await logger.step('Verify searched product', async () => {
    await flow.verifySkuNumberContains();
    await flow.verifyTotalPriceContains();
    await flow.verifyProductPriceInINR();
  });
  await logger.step('Add to cart searched product', async () => {
    await flow.addProductInCart();
  });

  await logger.step('Verify cart and notes details', async () => {
    await flow.clickOnViewCart();
  });

  await logger.step('Continue to delivery options', async () => {
    await flow.continueToDeliveryOptions();
  });

  await logger.step('Verify delivery options', async () => {
    await flow.verifyDeliveryOptions();
    await flow.verifySubTotal();
  });

  await logger.step('Verify first address selected', async () => {
    await flow.verifyFistAddressSelected();
  });
  await logger.step('Compare sub total and total price', async () => {
    await flow.compareSubTotalAndTotalPrice();
    
  });

  await logger.step('Review order Details ', async () => {
    const { subTotal, gst, total } = await flow.calculatePriceWithGST();
    await logger.info(`SubTotal: $${subTotal}`);
    await logger.info(`GST: $${gst}`);
    await logger.info(`Total: $${total}`);

  });
  await logger.step('Accept terms and conditions', async () => {
    await flow.acceptTerms();
  });

  await logger.step('Place order', async () => {
    await flow.placeOrder();
  });

  await logger.step('Verify order placed successfully', async () => {
    await flow.verifyOrderSaved();
  });
});
