import { test } from '@playwright/test';
import { injectCookie } from '../utils';
import { InventoryPage } from '../pages/inventoryPage';
import { CartPage } from '../pages/cartPage';
import { PRODUCTS } from '../data/products';
import { CheckoutPage } from '../pages/checkoutPage';
import { USER_DETAILS } from '../data/user';

test('saucedemo App', async ({ page }) => {
  await test.step('Inventory Page', async () => {
    const inventoryPage = new InventoryPage(page);
    await injectCookie(page);
    await inventoryPage.visit();
    await inventoryPage.sortByCheapest();
    await inventoryPage.addToCart(PRODUCTS.onesie.add);
    await inventoryPage.viewItem(PRODUCTS.backpack.view);
    await inventoryPage.addToCart(PRODUCTS.backpack.add);
    await inventoryPage.goToCart();
  });
  await test.step('Cart Page', async () => {
    const cartPage = new CartPage(page);
    await cartPage.assertTwoItemsCartList();
    await cartPage.removeFromCart(PRODUCTS.onesie.remove);
    await cartPage.assertOneItemCartList();
    await cartPage.goToCheckout();
  });
  await test.step('Checkout Page', async () => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillUserInfo(USER_DETAILS);
    await checkoutPage.continueToOverview();
    await checkoutPage.completeOrder();
    await checkoutPage.verifySuccessOrder();
  });
});
