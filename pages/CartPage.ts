import { Page } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) {}

  async checkout() {
    await this.page.click('[data-test="checkout"]');
  }
}
