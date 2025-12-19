import { test } from '@playwright/test';
import { DHLCareersPage } from '../pages/DHLCareersPage';
import { DataHelper } from '../../framework/utils/DataHelper';

test.describe('DHL Careers Page Tests', () => {
  test('Verify Chinese (zh) content on DHL Careers page', async ({ page }, testInfo) => {
    // Load data
    // DataHelper looks in test/data/ by default
    const zhData = DataHelper.loadJsonData<any>('zh.json');
    const content = zhData.zh;

    // Initialize Page Object
    const dhlPage = new DHLCareersPage(page, 'https://careers.dhl.com/apac/zh', testInfo);

    // Open Page
    await dhlPage.open();

    // Verify Content
    await dhlPage.verifyPageContent(content);
  });
});
