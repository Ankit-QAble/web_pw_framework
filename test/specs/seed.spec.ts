import { test } from '../../framework/core/BaseTest';

test('seed', async ({ page }) => {
  const url =
    process.env.BASE_URL ||
    ((global as any).selectedProfile && (global as any).selectedProfile.baseURL) ||
    'https://www.saucedemo.com/';
  await page.goto(url, { waitUntil: 'domcontentloaded' });
})
