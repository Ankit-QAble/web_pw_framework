import { test } from '../../../framework/core/BaseTest';
import { LoginAgmontPage } from '../../pages/ai/LoginAgmontPage';

test('LoginAgmont', async ({ page }, testInfo) => {
  const loginPage = new LoginAgmontPage(page, 'https://testlgd.augmont.com/login', testInfo);
  await loginPage.open();
  await loginPage.login('abin@mailinator.com', 'Test1234');
  await loginPage.verifyHeader();
  await loginPage.verifyUserName();
  await loginPage.verifyFiltersVisible();
});
