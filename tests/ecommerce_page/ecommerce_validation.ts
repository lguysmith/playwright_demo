import { expect } from "@playwright/test";
import { ProductCard } from "../../pages/components/ecommerce_product_card";
import { imageLoaded } from "../shared_validation";
/**
 * Shared validation for ecommerce tests
 */
/**
 * Validates a list of product cards against expected ecommerce product data.
 * @param productCardList The list of product cards to validate
 * @param ecommerceProducts The expected ecommerce product data
 */
export async function validateProductCards(
  productCardList: ProductCard[],
  ecommerceProducts: { product: string; price: number }[]
) {
  for (let i = 0; i < ecommerceProducts.length; i++) {
    await validateProductCard(productCardList[i], {
      title: ecommerceProducts[i].product,
      price: ecommerceProducts[i].price.toString(),
    });
  }
}
/**
 * Validates the contents of a product card against expected values.
 * @param card The card on the ecommerce page to validate
 * @param product An object containing the expected title and price of the product
 */
export async function validateProductCard(
  card: ProductCard,
  product: {
    title: string;
    price: string;
  }
) {
  await expect(
    card.image,
    `Expected product image for ${product.title}`
  ).toBeVisible();
  await imageLoaded(card.image);
  await expect(
    card.addToCartButton,
    `Expected add to cart button for ${product.title}`
  ).toBeVisible();
  await expect(
    card.quantityInput,
    `Expected quantity input for ${product.title}`
  ).toBeVisible();
  await expect(
    card.title,
    `Expected product title for ${product.title}`
  ).toHaveText(product.title);
  await expect(
    card.price,
    `Expected product price for ${product.title}`
  ).toHaveText(`Price: $${product.price}`);
}
