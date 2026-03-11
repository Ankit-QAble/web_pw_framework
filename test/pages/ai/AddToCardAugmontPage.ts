import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../../framework/core/BasePage';
import { AddToCardAugmontLocators as locators } from '../../locators/ai/AddToCardAugmontLocators';
import augmontData from '../../data/augmontData.json';

export class AddToCardAugmontPage extends BasePage {
  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    const defaultUrl = (global as any).selectedProfile?.baseURL || process.env.BASE_URL;
    super(page, url || defaultUrl, testInfo);
  }

  async open(): Promise<void> {
    await this.navigate();
    await this.waitForPageLoad();
  }

  async login(email: string, password: string): Promise<void> {
    const emailInput = this.byRole('textbox', { name: locators.emailFieldName });
    const passwordInput = this.byRole('textbox', { name: locators.passwordFieldName });
    const signInButton = this.byRole('button', { name: locators.signInButtonName });

    await this.click(emailInput, 30000);
    await this.fill(emailInput, email, 30000);
    await this.click(passwordInput, 30000);
    await this.fill(passwordInput, password, 30000);
    await this.waitUntilElementClickable(this.byRole('button', { name: locators.signInButtonName }));
    await this.click(signInButton, 30000);
    await this.waitForPageLoad();
  }

  async verifyUserName(): Promise<void> {
    await this.getTextAndCompare(locators.topbar, locators.topbarUserFullName, false);
  }

  async applyGIAFilter(): Promise<void> {
    await this.click(this.byRole('button', { name: locators.giaButtonName }));
  }

  async applyFilters(): Promise<void> {
    await this.waitUntilElementClickable(this.byRole('button', { name: locators.applyFiltersButtonName }));
    await this.click(this.byRole('button', { name: locators.applyFiltersButtonName }));
  }

  async clearAll(): Promise<void> {
    await this.waitUntilElementPresent(locators.clearAllButtonName);
    await this.click(this.locator(locators.clearAllButtonName));
  }

  async clickLogo(): Promise<void> {
    await this.click(this.byRole('img', { name: locators.logoImgName, exact: true }));
  }

  async searchCertificate(code: string): Promise<void> {
    const input = this.byRole('textbox', { name: locators.searchFieldName });
    await this.click(input);
    await this.fill(input, code);
    await input.press('Enter');
  }

  async openGrid(): Promise<void> {
    await this.click(locators.gridSelector);
  }





  //------------------------------------------------
  async selectProductByCode(code: string): Promise<void> {
    const productCard = this.locator(locators.skuNumber).getByText(code);
    await this.click(productCard);
  }

  async verifySkuNumberContains(): Promise<void> {
    await this.getTextAndCompare(locators.skuNumber, augmontData.AugData.productCode, false);
  }

  async verifyTotalPriceContains(): Promise<void> {
    await this.getTextAndCompare(locators.totalPrice, augmontData.AugData.productPrice, false);
  }

  async verifyProductPriceInINR(): Promise<void> {
    await this.getTextAndCompare(locators.rupeePriceText, augmontData.AugData.INRPrice, false);
  }

  async addProductInCart(): Promise<void> {
    if (await this.locator(locators.removeFromCartButton).isVisible()) {
      await this.click(locators.removeFromCartButton, 15000);
      await this.click(locators.addToCartButton);
    } else {
      await this.click(locators.addToCartButton);
    }
  }

  async clickOnViewCart(): Promise<void> {
    await this.click(locators.viewCartButton);
  }

  async verifyBuybackInfo(): Promise<void> {
    await this.getTextAndCompare(locators.buybackComponent, locators.buybackLocationText, false);
    await this.getTextAndCompare(locators.buybackComponent, locators.buybackGuaranteeText, false);
  }

  async addToCart(): Promise<void> {
    const addBtn = this.locator(locators.addToCartButton);
    const removeBtn = this.locator(locators.removeFromCartButton);
    if (await removeBtn.isVisible()) {
      await this.waitUntilElementClickable(removeBtn, 15000);
      await this.click(removeBtn, 15000);
    } else {
      await this.waitUntilElementClickable(addBtn, 15000);
      await this.click(addBtn, 15000);
    }
  }

  async openCartTotals(): Promise<void> {
    await this.click(this.byRole('button', { name: locators.cartTotalButtonName }));
  }

  async verifyCartDialogContainsCode(code: string): Promise<void> {
    await this.expectVisible(this.page.getByRole('dialog').getByText(code));
  }

  async clickCartAmount(): Promise<void> {
    await this.click(this.page.getByRole('dialog').getByText(locators.cartAmountText));
  }

  async openViewCart(): Promise<void> {
    await this.click(this.locator(locators.viewCartButtonName));
  }

  async deleteCartItems(): Promise<void> {
    await this.click(this.byRole('button', { name: locators.deleteItemButtonName }).nth(2));
    await this.click(this.byRole('button', { name: locators.deleteItemButtonName }).first());
  }

  async verifyCartItemContains(code: string): Promise<void> {
    await this.getTextAndCompare(locators.cartItem, code, false);
  }

  async openProductHeading(text: string): Promise<void> {
    await this.click(this.byRole('heading', { name: text }));
  }

  async backToSearchResults(): Promise<void> {
    await this.click(this.byRole('button', { name: locators.backToSearchResultsButtonName }));
  }

  async clickDollarIndices(): Promise<void> {
    await this.click(this.page.getByText(locators.dollarTextSymbol).nth(2));
    await this.click(this.page.getByText(locators.dollarTextSymbol).nth(3));
  }

  async continueToDeliveryOptions(): Promise<void> {
    await this.getTextAndCompare(locators.subTotal, augmontData.AugData.productPrice, false);
    await this.click(this.locator(locators.continueToDeliveryOptionsButtonName));
  }

  async verifyDeliveryOptions(): Promise<void> {
    await this.expectVisible(this.locator(locators.deliveryOptionsHeadingText));
    await this.getTextAndCompare(locators.deliveryOptionsComponent, locators.deliveryOptionsIntroText, false);
    await this.getTextAndCompare(locators.deliveryOptionsComponent, locators.deliveryAddressText, false);
    await this.expectVisible(locators.relativeSecondSection);
  }

  async verifySubTotal(): Promise<void> {
    await this.getTextAndCompare(locators.subTotal, augmontData.AugData.productPrice, false);
  }

  async verifyFistAddressSelected(): Promise<void> {
    const address = this.locator(locators.fistAddressSelected);
    if (await address.isVisible()) {
      console.log('First address selected');
    } else {
      await this.click(locators.firstAddress);
    }
  }

  async compareSubTotalAndTotalPrice(): Promise<void> {
    await this.getTextAndCompare(locators.subTotal, augmontData.AugData.productPrice, false);
    await this.click(locators.reviewOrderButton);
  }

  async verifyCartValues(): Promise<void> {
    await this.getTextAndCompare(locators.cartComponent, locators.cartSubtotalText, false);
    await this.getTextAndCompare(locators.cartComponent, locators.cartChargesText, false);
  }

  async calculatePriceWithGST() {
    await this.wait(1000);
    const subTotalText = await this.getText(locators.subTotal);

    const subTotal = parseFloat(subTotalText.replace(/[^0-9.]/g, ''));

    const gst = subTotal * 0.015;
    const total = subTotal + gst;

    return {
      subTotal: subTotal.toFixed(2),
      gst: gst.toFixed(2),
      total: total.toFixed(2)
    };
    
  }


  async verifyReviewOrderSections(): Promise<void> {
    await this.expectVisible(locators.relativeThirdSection);
  }

  async verifyTotalsAndItem(code: string, headingText: string): Promise<void> {
    await this.getTextAndCompare(locators.cartItem, code, false);
    await this.getTextAndCompare('h4', headingText, false);
    await this.getTextAndCompare(locators.cartComponent, locators.cartSubtotalText, false);
    await this.getTextAndCompare(locators.cartComponent, locators.cartChargesText, false);
    await this.getTextAndCompare(locators.cartComponent, locators.cartTotalText, false);
  }

  async acceptTerms(): Promise<void> {
    await this.isVisible(locators.placeOrderDisabled);
    await this.click(locators.termsAndConditions);
    await this.isVisible(locators.placeOrderEnabled);
  }

  async verifyRupeePrice(): Promise<void> {
    await this.getTextAndCompare(locators.cartItem, locators.rupeePriceText, false);
  }

  async placeOrder(): Promise<void> {
    await this.click(locators.placeOrderEnabled);
  }

  async verifyOrderSaved(): Promise<void> {
    await this.waitUntilElementPresent(locators.orderSavedHeadingText);
  }

  async verifyCartEmpty(): Promise<void> {
    await this.openCartTotals();
    await this.expectVisible(this.page.locator('div').filter({ hasText: locators.emptyCartText }).nth(3));
  }
}
