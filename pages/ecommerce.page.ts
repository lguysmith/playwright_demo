import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { ProductCardList } from "./components/ecommerce_product_card";

export class EcommercePage extends BasePage {
  //Note there is a typo in the URL but it is intentional as that is how the site is set up
  url = "/practice-ecommerece-website";
  readonly title: string = "Dummy E-commerce | TesterBud";

  searchResultsHeading: Locator;
  searchBox: Locator;
  productCardList: ProductCardList;

  constructor(page: Page) {
    super(page);
    this.productCardList = new ProductCardList(page);
    this.searchResultsHeading = page.getByRole("heading", {
      name: "Search Results for",
    });
    this.searchBox = page.getByRole("searchbox", { name: "Search" });
  }
}
