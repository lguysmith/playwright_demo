import { Locator, Page } from "@playwright/test";

export type PaymentDetails = {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
};
/**
 * Represents the payment modal component on the e-commerce page. 
 * Provides methods to interact with and fill in payment details.
 */
export class PaymentModal {
  readonly cardNumberInput: Locator;
  readonly expiryDateInput: Locator;
  readonly cvvInput: Locator;
  readonly buyNowButton: Locator;
  readonly closePaymentFormButton: Locator;

  constructor(page: Page) {
    this.cardNumberInput = page.locator("#formCardNumber");
    this.expiryDateInput = page.locator("#formExpiryDate");
    this.cvvInput = page.locator("#formCVV");
    this.buyNowButton = page.getByRole("button", { name: "Buy Now" });
    this.closePaymentFormButton = page.locator("button.btn-close");
  }

  async setCardNumber(cardNumber: string) {
    await this.cardNumberInput.fill(cardNumber);
  }

  async setExpiryDate(expiryDate: string) {
    await this.expiryDateInput.fill(expiryDate);
  }

  async setCVV(cvv: string) {
    await this.cvvInput.fill(cvv);
  }

  async clickBuyNow() {
    await this.buyNowButton.click();
  }

  async fillPaymentDetails(payment: PaymentDetails) {
    await this.setCardNumber(payment.cardNumber);
    await this.setExpiryDate(payment.expiryDate);
    await this.setCVV(payment.cvv);
  }

  async closePaymentForm() {
    await this.closePaymentFormButton.click();
  }
}