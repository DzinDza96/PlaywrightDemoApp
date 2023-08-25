import { Page, expect } from '@playwright/test';
import { PRODUCTS } from '../data/products';
import { InventoryPage } from './inventoryPage';

export class CartPage extends InventoryPage {
  constructor(public page: Page) {
    super(page);
  }

  cartList = this.page.locator('.cart_list');
  cartItem = this.cartList.locator('.cart_item');
  checkoutLink = this.page.getByTestId('checkout');

  async assertTwoItemsCartList() {
    //expecting that there are two items in the cart list with corresponding titles
    await expect(this.cartItem).toHaveCount(2);
    //item titles passed to expect block
    await expect(this.page.locator('.inventory_item_name').nth(0)).toHaveText(PRODUCTS.onesie.view);
    await expect(this.page.locator('.inventory_item_name').nth(1)).toHaveText(
      PRODUCTS.backpack.view
    );
  }

  async assertOneItemCartList() {
    await expect(this.cartItem).toHaveCount(1);
    await expect(this.page.locator('.inventory_item_name').nth(0)).toHaveText(
      PRODUCTS.backpack.view
    );
  }

  async goToCheckout() {
    await this.checkoutLink.waitFor();
    await this.checkoutLink.click();
    await this.page.waitForURL('/checkout-step-one.html');
  }
}
