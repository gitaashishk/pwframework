import { Page } from '@playwright/test';

export class InventoryPage {
  constructor(private page: Page) {}

  async addItemToCart(itemName: string) {
    await this.page.click(`button[data-test="add-to-cart-${itemName}"]`);
  }

  async navigateToCart() {
    await this.page.click('.shopping_cart_link');
  }
}
