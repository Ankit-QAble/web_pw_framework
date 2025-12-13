import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';
import { ProductPageLocators } from '../locators/ProductPageLocators';
import { faker } from '@faker-js/faker';

const randomString = faker.string.alphanumeric(8);
export class ProductPage extends BasePage {
    constructor(page: Page, url: string, testInfo?: TestInfo) {
        super(page, url, testInfo);
    }

    async login(mobile: string, password: string) {
        await this.navigate();
        await this.fill(ProductPageLocators.mobileNumberField, mobile);
        await this.fill(ProductPageLocators.passwordField, password);
        await this.click(ProductPageLocators.loginButton);
    }

    async enterOtp(otp: string) {
        const otpDigits = otp.split('');
        if (otpDigits.length !== 6) {
             throw new Error("OTP must be 6 digits");
        }
        
        await this.fill(ProductPageLocators.otpInput1, otpDigits[0]);
        await this.fill(ProductPageLocators.otpInput2, otpDigits[1]);
        await this.fill(ProductPageLocators.otpInput3, otpDigits[2]);
        await this.fill(ProductPageLocators.otpInput4, otpDigits[3]);
        await this.fill(ProductPageLocators.otpInput5, otpDigits[4]);
        await this.fill(ProductPageLocators.otpInput6, otpDigits[5]);
        await this.pressEnter();
    }

    async navigateToBasicStore() {
        // Handle potential Cancel button if it appears
        try {
            // Using page.locator to check visibility with timeout as BasePage.isVisible doesn't support timeout parameter
            await this.waitForTimeout(5000);
            await this.pressEscape();
        } catch (e) {
            this.logger.info("Cancel button not found or not needed");
        }

        // Navigate to basic store
        await this.click(ProductPageLocators.sidebarLogo);
        await this.click(ProductPageLocators.basicStoreLink);
    }

    async initiateCreateProduct() {
        await this.click(ProductPageLocators.createProductButton);
    }

    async fillProductDetails(details: {
        
        name: string,
        price: string,
        quantity: string,
        unitOption: string,
        description: string,
        imagePath?: string
    }) {
        if (details.imagePath) {
             //await this.uploadFileViaButton(ProductPageLocators.productImageUpload, details.imagePath);
        }

        await this.fill(ProductPageLocators.productNameInput, `${details.name} ${randomString}`);
        await this.fill(ProductPageLocators.productPriceInput, details.price);
        
        await this.fill(ProductPageLocators.productQuantityInput, details.quantity);
        
        await this.selectOption(ProductPageLocators.productUnitSelect, details.unitOption);
        await this.fill(ProductPageLocators.productDescriptionInput, details.description);
        
        await this.click(ProductPageLocators.unlimitedAvailabilityCheckbox);
    }

    async submitProduct() {
        await this.click(ProductPageLocators.submitCreateProductButton);
    }
}
