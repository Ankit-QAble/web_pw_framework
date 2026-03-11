import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../../framework/core/BasePage';
import { orderPaymentLocators as locators } from '../../locators/ai/orderPaymentLocator';
import augmontData from '../../data/augmontData.json';

export class orderPaymentPage extends BasePage {
   orderPrice?: string;
   inrPrice?: string;

  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    const defaultUrl = (global as any).selectedProfile?.baseURL || process.env.BASE_URL;
    super(page, url || defaultUrl, testInfo);
  }

  async open(): Promise<void> {
    await this.navigate();
    await this.waitForPageLoad();
    await this.maximizeScreen(1400, 1024);
  }
  async openUserMenu(): Promise<void> {
    await this.click(locators.openUserManu);
  }

  async openMyOrder(): Promise<void> {
    await this.click(locators.myOrderButton);
  }

  async clickOnPendoing(): Promise<void> {
    this.orderPrice = await this.getText(locators.orderPrice);
    this.inrPrice = await this.getText(locators.inrPrice);
    await this.isVisible(locators.paymentPending);
    await this.click(locators.paymentPending);
  }

  async verifySubTotal(): Promise<void> {
    await this.wait(2000);
    const totalPrice = await this.getText(locators.totalPrice);
    await this.compareTextValue(this.orderPrice ?? '', totalPrice, false);
  }

  async selectCardPayment(): Promise<void> {
    await this.click(locators.payNowButton);
    await this.click(locators.paaymentPayNowNutton);
    await this.waitUntilElementClickable(locators.cardDetailsButton);
    await this.click(locators.cardDetailsButton);

  }
  async enterCardDetails(): Promise<void> {
    await this.waitUntilElementClickable(locators.cardNumberInput);
    await this.fill(locators.cardNumberInput, augmontData.paymentData.cardNumber);
    await this.fill(locators.expiryDateInput, augmontData.paymentData.expiryDate);
    await this.fill(locators.cvvInput, augmontData.paymentData.cvv);
    await this.fill(locators.cardNameInput, augmontData.paymentData.cardName);
    await this.click(locators.agreeButton);
    await this.click(locators.proceedButton);
    await this.fill(locators.otpInput, augmontData.paymentData.OTP);
    await this.click(locators.paySubmitButton);
  }
  async verifyPaymentSuccess(): Promise<void> {
    await this.waitUntilElementPresent(locators.paymentSuccessText);
    await this.isVisible(locators.paymentSuccessText);
    await this.verifyText(locators.paymentSuccessText, 'Payment Success!', false);
  }
  async verifyPaidAmount(): Promise<void> {
    const paidAmount = await this.getText(locators.paidAmount);
    await this.compareTextValue(this.inrPrice ?? '', paidAmount, false);
  }





}
