import { Locator, Page } from "@playwright/test";

/**
 * Represents a single product card component on the e-commerce page.
 * Provides methods to interact with and retrieve information from the card.
 */
export class ProductCard {
  public readonly card: Locator;

  constructor(card: Locator) {
    this.card = card;
  }

  get image() {
    return this.card.locator("img.card-img-top");
  }

  get title() {
    return this.card.locator(".card-title");
  }

  get price() {
    return this.card.locator(".card-subtitle");
  }

  get quantityInput() {
    return this.card.locator('input[type="number"]');
  }

  get addToCartButton() {
    return this.card.locator("button.btn-primary");
  }

  async getTitleText() {
    return this.title.textContent();
  }

  async getPriceText() {
    return this.price.textContent();
  }

  async setQuantity(qty: number) {
    await this.quantityInput.fill(qty.toString());
  }

  async addToCart() {
    await this.addToCartButton.click();
  }
}

export class ProductCardList {
  private readonly page: Page;


  constructor(page: Page) {
    this.page = page;
  }

  get cards() {
    return this.page.locator(".card");
  }

  async getAllCards(): Promise<ProductCard[]> {
    const count = await this.cards.count();
    const cardObjs: ProductCard[] = [];
    for (let i = 0; i < count; i++) {
      cardObjs.push(new ProductCard(this.cards.nth(i)));
    }
    return cardObjs;
  }

  getCardByTitle(title: string): ProductCard {
    const card = this.cards.filter({
      has: this.page.locator(".card-title", { hasText: title }),
    });
    return new ProductCard(card.first());
  }
}
