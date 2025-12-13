import { test } from '../../framework/core/BaseTest';
import { ProductPage } from '../pages/ProductPage';
import productData from '../data/productData.json';

test.describe('Product Management', () => {
    let productPage: ProductPage;

    test.beforeEach(async ({ page }, testInfo) => {
        productPage = new ProductPage(page, productData.url, testInfo);
    });

    test('should create a new product successfully', async () => {
        // Login
        await productPage.login(productData.credentials.mobile, productData.credentials.password);
        
        // Handle OTP
        await productPage.enterOtp(productData.otp);
        
        // Navigate
        await productPage.navigateToBasicStore();
        
        // Create Product
        await productPage.initiateCreateProduct();
        
        await productPage.fillProductDetails(productData.newProduct);
        
        await productPage.submitProduct();
    });
});
