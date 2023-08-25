import { Page, expect } from '@playwright/test';

export class CheckoutPage {
  constructor(public page: Page) {
    this.page = page;
  }

  firstNameInput = this.page.getByTestId('firstName');
  lastNameInput = this.page.getByTestId('lastName');
  zipInput = this.page.getByTestId('postalCode');
  continueBtn = this.page.getByTestId('continue');
  finishBtn = this.page.getByTestId('finish');
  backHomeBtn = this.page.getByTestId('back-to-products');
  successOrderMessage = this.page.locator('.complete-header');

  async fillUserInfo(userDetails) {
    const { firstName, lastName, zip } = userDetails;
    await this.firstNameInput.waitFor();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.waitFor();
    await this.lastNameInput.fill(lastName);
    await this.zipInput.waitFor();
    await this.zipInput.fill(zip);
  }

  async continueToOverview() {
    await this.continueBtn.waitFor();
    await this.continueBtn.click();
    await this.page.waitForURL('/checkout-step-two.html');
  }

  async completeOrder() {
    await this.finishBtn.waitFor();
    await this.finishBtn.click();
    await this.page.waitForURL('/checkout-complete.html');
  }
  async verifySuccessOrder() {
    await this.successOrderMessage.waitFor();
    await expect(this.successOrderMessage).toHaveText('Thank you for your order!');
    await this.backHomeBtn.waitFor();
    await this.backHomeBtn.click();
    await this.page.waitForURL('/inventory.html');
  }
}
