import { Page } from '@playwright/test';

//inject cookie to bypass login through the FE
export async function injectCookie(page: Page) {
  await page.addInitScript(() => {
    document.cookie = 'session-username=standard_user';
  });
}
