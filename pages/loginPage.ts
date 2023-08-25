import { Page } from '@playwright/test';

export class LoginPage {
  constructor(public page: Page) {
    this.page = page;
  }

  usernameInput = this.page.getByTestId('username');
  passwordInput = this.page.getByTestId('password');
  loginBtn = this.page.getByTestId('login-button');
  errorMessage = this.page.getByTestId('error');

  async visit() {
    await this.page.goto('/');
  }

  async login(email, password) {
    await this.usernameInput.waitFor();
    await this.usernameInput.fill(email);
    await this.passwordInput.waitFor();
    await this.passwordInput.fill(password);
    await this.loginBtn.waitFor();
    await this.loginBtn.click();
  }
}
