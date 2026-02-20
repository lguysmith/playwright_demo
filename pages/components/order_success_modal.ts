import { Locator, Page } from "@playwright/test";

/**
 * Represents the order success modal shown after a successful purchase.
 * Provides methods to validate order details and finalize checkout.
 */
export class OrderSuccessModal {
  readonly orderSuccessHeading: Locator;
  readonly orderSuccessMessage: Locator;
  readonly orderItemsList: Locator;
  readonly doneButton: Locator;

  constructor(page: Page) {
    this.orderSuccessHeading = page.getByRole("heading", {
      name: "Order Successful!",
    });
    this.orderSuccessMessage = page.getByText(
      "Woohoo!! Successfully purchased"
    );
    this.orderItemsList = page.locator(".list-group");
    this.doneButton = page.getByRole("button", { name: "Done" });
  }

  async clickDone() {
    await this.doneButton.click();
  }

  async getOrderItemText(index: number = 0) {
    return await this.orderItemsList
      .locator(".list-group-item")
      .nth(index)
      .textContent();
  }
}