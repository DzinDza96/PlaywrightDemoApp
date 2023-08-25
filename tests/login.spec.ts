import * as dotenv from 'dotenv';
dotenv.config();
import { test, expect } from '@playwright/test';
import { USER_CREDENTIALS } from '../data/user';
import { LoginPage } from './../pages/loginPage';

let loginPage: LoginPage;
test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  await loginPage.visit();
});

test.describe('Login Page tests', () => {
  test('Login as standard user', async ({ page }) => {
    await loginPage.login(USER_CREDENTIALS.standardUsername, USER_CREDENTIALS.userPassword);
    await expect(page).toHaveURL('/inventory.html');
  });
  test('Login as locked user', async ({ page }) => {
    await loginPage.login(USER_CREDENTIALS.lockedUsername, USER_CREDENTIALS.userPassword);
    await expect(page).not.toHaveURL('/inventory.html');
    await expect(loginPage.errorMessage).toBeVisible();
  });
});
