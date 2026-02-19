import { Locator, Page } from "@playwright/test";

export type ShippingAddress = {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
};

/**
 * Represents the shipping address modal component on the e-commerce page. 
 * Provides methods to interact with and fill in shipping address details.
 */
export class ShippingAddressModal {
  readonly shippingNameInput: Locator;
  readonly shippingStreetInput: Locator;
  readonly shippingCityInput: Locator;
  readonly shippingStateInput: Locator;
  readonly shippingZipInput: Locator;
  readonly saveAddressButton: Locator;
  readonly closeShippingFormButton: Locator;

  constructor(page: Page) {
    this.shippingNameInput = page.locator("#formName");
    this.shippingStreetInput = page.locator("#formStreet");
    this.shippingCityInput = page.locator("#formCity");
    this.shippingStateInput = page.locator("#formState");
    this.shippingZipInput = page.locator("#formZip");
    this.saveAddressButton = page.getByRole("button", {
      name: "Save Address & Continue to Payment",
    });
    this.closeShippingFormButton = page.locator("button.btn-close");
  }

  async setShippingName(name: string) {
    await this.shippingNameInput.click();
    await this.shippingNameInput.fill(name);
  }

  async setShippingStreet(street: string) {
    await this.shippingStreetInput.click();
    await this.shippingStreetInput.fill(street);
  }

  async setShippingCity(city: string) {
    await this.shippingCityInput.click();
    await this.shippingCityInput.fill(city);
  }

  async setShippingState(state: string) {
    await this.shippingStateInput.click();
    await this.shippingStateInput.fill(state);
  }

  async setShippingZip(zip: string) {
    await this.shippingZipInput.fill(zip);
  }

  async clickSaveAddress() {
    await this.saveAddressButton.click();
  }

  async fillShippingAddress(address: ShippingAddress) {
    await this.setShippingName(address.name);
    await this.setShippingStreet(address.street);
    await this.setShippingCity(address.city);
    await this.setShippingState(address.state);
    await this.setShippingZip(address.zip);
  }

  async closeShippingForm() {
    await this.closeShippingFormButton.click();
  }
}