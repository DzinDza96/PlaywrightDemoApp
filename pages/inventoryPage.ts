import { Page, expect } from '@playwright/test';

export class InventoryPage {
  constructor(public page: Page) {
    this.page = page;
  }

  shopingChartLink = this.page.locator('.shopping_cart_link');
  shopingChartBadge = this.shopingChartLink.locator('.shopping_cart_badge');
  sortDropdown = this.page.getByTestId('product_sort_container');
  inventoryPrice = this.page.locator('.inventory_item_price');

  async getShopingCartCount() {
    let isVisible = await this.shopingChartBadge.isVisible({ timeout: 500 }); //returns true/false
    if (isVisible) {
      //if the elements is visible catch its text and return number
      const count = await this.shopingChartBadge.innerText();
      return parseInt(count);
    }
    return 0; //if the element is not visible return 0
  }

  async countValues(product: string) {
    const countBeforeAdding = await this.getShopingCartCount(); //count value before adding to the cart
    await this.page.getByTestId(product).waitFor(); //wait for is used to determine if the element is visible
    await this.page.getByTestId(product).click(); //adding an item to the cart based on the testId that is passed to the function
    const countAfterAdding = await this.getShopingCartCount(); //count value after adding to the cart
    return { countAfterAdding, countBeforeAdding };
  }

  async addToCart(product: string) {
    const { countAfterAdding, countBeforeAdding } = await this.countValues(product); //passed values from the countValues function
    expect(countAfterAdding).toBeGreaterThan(countBeforeAdding); //asertujem that the count increases
  }

  async removeFromCart(product: string) {
    const { countAfterAdding, countBeforeAdding } = await this.countValues(product); //passed values from the countValues function
    expect(countAfterAdding).toBeLessThan(countBeforeAdding); //asertujem that the count decreases
  }

  async visit() {
    await this.page.goto('/inventory.html');
    expect(this.page).toHaveURL('/inventory.html');
  }

  async goToCart() {
    await this.shopingChartLink.waitFor();
    await this.shopingChartLink.click();
    await this.page.waitForURL('/cart.html'); //assert url
  }

  async viewItem(itemName: string) {
    //catch the item based on the passed element text
    const item = this.page.locator('.inventory_item_name', { hasText: itemName });
    await item.waitFor();
    await item.click();
  }

  async sortByCheapest() {
    await this.sortDropdown.waitFor(); //wait for is used to determine if the element is visible
    await this.sortDropdown.selectOption('lohi'); //sorting low -> high
    await this.inventoryPrice.first().waitFor();
    //prices array contains ['$7.99', '$16,99'...]
    const prices = await this.inventoryPrice.allInnerTexts();
    const pricesArr = prices.map((el) => {
      //replacing '$' with empty string and return numbers array
      const withoutDollar = el.replace('$', '');
      return parseInt(withoutDollar);
    });
    //expect that the element with the lowest price is at the array first index
    let minPrice = Math.min(...pricesArr);
    let minIndex = pricesArr.indexOf(minPrice);
    expect(minIndex).toBe(0);
    //expect that the element with the highest price is at the array last index
    let maxPrice = Math.max(...pricesArr);
    let maxIndex = pricesArr.indexOf(maxPrice);
    expect(maxIndex).toBe(pricesArr.length - 1);
  }
}
