import { test, expect } from '@playwright/test';
import loginData from '../test-data/loginData.json';
import checkoutdata from '../test-data/checkoutdata.json';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Login and Checkout Tests', () => {
  loginData.forEach((data, i) => {
    test(`Test ${i + 1} for user: ${data.username}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(data.username, data.password);

      if (data.shouldLogin) {
        const success = await loginPage.isLoginSuccessful();
        expect(success).toBe(true);

        if (success && data.checkoutItems && data.checkoutInfo) {
          const inventoryPage = new InventoryPage(page);
          for (const item of data.checkoutItems) {
            await inventoryPage.addItemToCart(item);
          }
          await inventoryPage.navigateToCart();

          const cartPage = new CartPage(page);
          await cartPage.checkout();

          const checkoutPage = new CheckoutPage(page);
          const info = data.checkoutInfo;
          await checkoutPage.fillCheckoutInfo(info.firstName, info.lastName, info.zipCode);
          await checkoutPage.completeCheckout();

          const orderSuccess = await checkoutPage.isOrderSuccessful();
          expect(orderSuccess).toBe(true);
        }
      } else {
        const errorDisplayed = await loginPage.isLoginError();
        expect(errorDisplayed).toBe(true);

        const errorText = await loginPage.getLoginErrorMessage();
        expect(errorText).toContain('Username and password do not match');
      }
    });
  });
});

test.describe('Blank Delivery Details', () => {
  checkoutdata.forEach((data, i) => {
    test(`Test ${i + 1} Blank Delivery details for user: ${data.username}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(data.username, data.password);

      if (data.shouldLogin) {
        const success = await loginPage.isLoginSuccessful();
        expect(success).toBe(true);

        if (success && data.checkoutItems && data.checkoutInfo && data.TestCase === 'emptydeliverydetails') {
          const inventoryPage = new InventoryPage(page);
          for (const item of data.checkoutItems) {
            await inventoryPage.addItemToCart(item);
          }
          await inventoryPage.navigateToCart();

          const cartPage = new CartPage(page);
          await cartPage.checkout();

          const checkoutPage = new CheckoutPage(page);
          const info = data.checkoutInfo;
          await checkoutPage.fillCheckoutInfo(info.firstName, info.lastName, info.zipCode);

          if (page.url() === 'https://www.saucedemo.com/checkout-step-two.html') {
            await checkoutPage.completeCheckout();
            const orderSuccess = await checkoutPage.isOrderSuccessful();
            expect(orderSuccess).toBe(true);
          } else {
            console.log('Cannot place order due to invalid details');
            const checkoutErrorText = await checkoutPage.invalidcheckoutdetails();
            expect(checkoutErrorText).toContain('First Name is required');
          }
        }
      } else {
        const errorDisplayed = await loginPage.isLoginError();
        expect(errorDisplayed).toBe(true);

        const errorText = await loginPage.getLoginErrorMessage();
        expect(errorText).toContain('Username and password do not match');
      }
    });
  });
});
