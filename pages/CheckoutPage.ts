import { Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private page: Page) {}

  async fillCheckoutInfo(firstName: string, lastName: string, zipCode: string) {
    await this.page.fill('[data-test="firstName"]', firstName);
    await this.page.fill('[data-test="lastName"]', lastName);
    await this.page.fill('[data-test="postalCode"]', zipCode);
    await this.page.click('[data-test="continue"]');
  }

  async completeCheckout() {
    await this.page.click('[data-test="finish"]');
  }

  async isOrderSuccessful() {
    return this.page.isVisible('text=Thank you for your order!');
  }

  async ischeckouterror() {
    const checkerrorlocator = this.page.locator('[data-test="error"]');
    await checkerrorlocator.waitFor({ state: 'visible', timeout: 5000 });
    return await checkerrorlocator.isVisible();
  }


async invalidcheckoutdetails() {
  const checkouterrorLocator = this.page.locator('[data-test="error"]');
  //await checkouterrorLocator.waitFor({ state: 'visible', timeout: 5000 });
  return await checkouterrorLocator.textContent(); // Return the error message text
}
}

