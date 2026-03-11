import { test } from '../../../framework/core/BaseTest';
import { AutomationTestStorePage } from '../../pages/ai/AutomationTestStorePage';
import data from '../../data/ai/automationteststore.json';

test('automation test store flow', async ({ page }, testInfo) => {
  const atsPage = new AutomationTestStorePage(page, undefined, testInfo);
  await atsPage.open();
  await atsPage.login(data.credentials.username, data.credentials.password);
  await atsPage.verifyHomeLinkVisible();
  await atsPage.goToMenAndVerifyCategories();
  await atsPage.openBodyAndShowerAndAddTwoItems();
  await atsPage.openCart();
  await atsPage.verifyCartTotals();
});
