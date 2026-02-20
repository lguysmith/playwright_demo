import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { ProductCardList } from "./components/ecommerce_product_card";
import {
  ShippingAddress,
  ShippingAddressModal,
} from "./components/shipping_address_modal";
import { PaymentDetails, PaymentModal } from "./components/payment_modal";
import { OrderSuccessModal } from "./components/order_success_modal";

export class EcommercePage extends BasePage {
  //Note there is a typo in the URL but it is intentional as that is how the site is set up
  url = "/practice-ecommerece-website";
  readonly title: string = "Dummy E-commerce | TesterBud";

  searchResultsHeading: Locator;
  searchBox: Locator;
  productCardList: ProductCardList;
  shippingAddressModal: ShippingAddressModal;
  paymentModal: PaymentModal;
  orderSuccessModal: OrderSuccessModal;
  cartButton: Locator;
  closeCartButton: Locator;
  proceedToBuyButton: Locator; 

  constructor(page: Page) {
    super(page);
    this.productCardList = new ProductCardList(page);
    this.shippingAddressModal = new ShippingAddressModal(page);
    this.paymentModal = new PaymentModal(page);
    this.orderSuccessModal = new OrderSuccessModal(page);
    this.searchResultsHeading = page.getByRole("heading", {
      name: "Search Results for",
    });
    this.searchBox = page.getByRole("searchbox", { name: "Search" });
    this.cartButton = page.locator("//nav/div/div/button"); //This is not a great locator - ask devs to add aria-label or use a data-testid to make this more robust, but it is sufficient for demonstration purposes
    this.closeCartButton = page.getByLabel("Close");
    this.proceedToBuyButton = page.getByRole("button", { name: "Proceed to Buy" });
    
  }

  async openCart() {
    await this.cartButton.click();
  }
  async closeCart() {
    await this.cartButton.click();
  }
  async clickProceedToBuy() {
    await this.proceedToBuyButton.click();
  }

}
