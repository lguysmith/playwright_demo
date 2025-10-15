import { Locator, expect } from "@playwright/test";
/**
 * Shared validation functions for tests
 */
/**
 * Checks if an image is loaded by checking the 'complete' property and 'naturalWidth'.
 * @param {Locator} imageLocator - Playwright locator for the image element.
 */
export async function imageLoaded(imageLocator: Locator) {
  await expect
    .soft(imageLocator, "Expected image to be loaded")
    .toHaveJSProperty("complete", true);
  expect(
    imageLocator.evaluate((img) => {
      if (img instanceof HTMLImageElement) {
        return img.naturalWidth;
      }
      throw new Error("Element is not an HTMLImageElement");
    }),
    "Expected image to have a width greater than 0 - this implies the image has loaded"
  ).not.toBe(0);
}
