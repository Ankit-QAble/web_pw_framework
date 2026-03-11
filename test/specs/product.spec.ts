import { test } from '../../framework/core/BaseTest';
import { ProductPage } from '../pages/ProductPage';
import productData from '../data/productData.json';

test.describe('Product Management', () => {
  let productPage: ProductPage;

  test.beforeEach(({ page }, testInfo) => {
    productPage = new ProductPage(page, productData.url, testInfo);
  });

  test('should create a new product successfully', async () => {
    await productPage.login(productData.credentials.mobile, productData.credentials.password);
    await productPage.enterOtp(productData.otp);
    await productPage.navigateToBasicStore();
    await productPage.initiateCreateProduct();
    await productPage.fillProductDetails(productData.newProduct);
    await productPage.submitProduct();
  });
});
