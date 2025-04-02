import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('https://www.saucedemo.com');
  }

  async login(username: string, password: string) {
    await this.page.fill('#user-name', username);
    await this.page.fill('#password', password);
    await this.page.click('#login-button');
  }

  async isLoginSuccessful() {
    await this.page.waitForLoadState('networkidle');
    return this.page.url().includes('/inventory.html');
  }

  async isLoginError() {
    const errorLocator = this.page.locator('[data-test="error"]');
    await errorLocator.waitFor({ state: 'visible', timeout: 5000 });
    return await errorLocator.isVisible();
  }

  async getLoginErrorMessage() {
    const errorLocator = this.page.locator('[data-test="error"]');
    await errorLocator.waitFor({ state: 'visible', timeout: 5000 });
    return await errorLocator.textContent(); // Return the error message text
  }
}
