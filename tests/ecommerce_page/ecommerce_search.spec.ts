import { test } from "../fixtures";
import { expect } from "@playwright/test";
import { phoneEcommerceProducts, ecommerceProducts } from "./ecommerce_data";
import { validateProductCards } from "./ecommerce_validation";

test("No search term shows all products", async ({
  page,
  ecommercePage,
  baseURL,
}) => {
  await ecommercePage.goto();
  await expect(page).toHaveTitle(ecommercePage.title);
  await expect(page).toHaveURL(await ecommercePage.getFullURL(baseURL));

  await expect(ecommercePage.searchBox).toBeVisible();
  await expect(ecommercePage.searchResultsHeading).not.toBeVisible();

  //check there are 20 items on the page by default
  await expect(ecommercePage.productCardList.cards).toHaveCount(20);
  const productCardList = await ecommercePage.productCardList.getAllCards();
  await validateProductCards(productCardList, ecommerceProducts);
});

test("Search for phone shows expected results", async ({ ecommercePage }) => {
  const searchTerm = "phone";
  await ecommercePage.goto();

  //Search for the search term and check the results displayed are correct
  await ecommercePage.searchBox.fill(searchTerm);
  await expect(ecommercePage.searchResultsHeading).toBeVisible();
  await expect(ecommercePage.searchResultsHeading).toHaveText(
    `Search Results for "${searchTerm}"`
  );
  //check there are only 6 results for phone and they have the expected product names and prices
  await expect(ecommercePage.productCardList.cards).toHaveCount(6);
  const productCardList = await ecommercePage.productCardList.getAllCards();
  await validateProductCards(productCardList, phoneEcommerceProducts);
});

test("Search for term with no results shows all products", async ({
  ecommercePage,
}) => {
  const searchTerm = "phnoe"; //intentionally mispelled to return no results
  await ecommercePage.goto();

  //Search for the search term and check the results displayed are correct
  await ecommercePage.searchBox.fill(searchTerm);
  await expect(ecommercePage.searchResultsHeading).not.toBeVisible();
  //check there are only 6 results for phone
  await expect(ecommercePage.productCardList.cards).toHaveCount(20);
  const productCardList = await ecommercePage.productCardList.getAllCards();
  await validateProductCards(productCardList, ecommerceProducts);
});

test("Search for one product shows correct result", async ({
  ecommercePage,
}) => {
  const searchTerm = "Iphone 14 pro";
  await ecommercePage.goto();
  //Search for the search term and check the results displayed are correct
  await ecommercePage.searchBox.fill(searchTerm);
  await expect(ecommercePage.searchResultsHeading).toBeVisible();
  await expect(ecommercePage.searchResultsHeading).toHaveText(
    `Search Results for "${searchTerm}"`
  );
  //check there is only 1 result for Iphone 14 pro and it has the expected product name and price
  await expect(ecommercePage.productCardList.cards).toHaveCount(1);
  const productCardList = await ecommercePage.productCardList.getAllCards();
  await validateProductCards(productCardList, [
    { product: "Iphone 14 pro", price: 1000 },
  ]);
});

test("Search heading and results update with each character entered and deleted", async ({
  ecommercePage,
}) => {
  const searchTerm = "product";
  const expectedNumProducts = [11, 6, 3, 1, 1, 1, 1]; //How many products expected for each character entered
  await ecommercePage.goto();
  //type the search term one character at a time and check the search updates correctly
  //since the cards returned are validated in a different test we just check the number of products returned
  await expect(ecommercePage.searchResultsHeading).not.toBeVisible();
  for (let i = 0; i < searchTerm.length; i++) {
    await ecommercePage.searchBox.focus();
    await ecommercePage.searchBox.press(searchTerm[i]);
    let expectedText = `Search Results for "${searchTerm.substring(0, i + 1)}"`;
    await expect(ecommercePage.searchResultsHeading).toBeVisible();
    await expect(ecommercePage.searchResultsHeading).toHaveText(expectedText);
    await expect(ecommercePage.productCardList.cards).toHaveCount(
      expectedNumProducts[i]
    );
  }
  //delete the search term one character at a time and check the Search updates correctly
  for (let i = searchTerm.length; i > 0; i--) {
    await expect(ecommercePage.productCardList.cards).toHaveCount(
      expectedNumProducts[i - 1]
    );
    await ecommercePage.searchBox.press("Backspace");
    let expectedText = `Search Results for "${searchTerm.substring(0, i - 1)}"`;
    if (i === 1) {
      await expect(ecommercePage.searchResultsHeading).not.toBeVisible();
    } else {
      await expect(ecommercePage.searchResultsHeading).toBeVisible();
      await expect(ecommercePage.searchResultsHeading).toHaveText(expectedText);
    }
  }
});
