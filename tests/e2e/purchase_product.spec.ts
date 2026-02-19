import { test, expect } from "../fixtures";

// Test data
const SHIPPING_ADDRESS = {
  name: "John Doe",
  street: "123 Main St",
  city: "New York",
  state: "NY",
  zip: "10001"
};

const PAYMENT_DETAILS = {
  cardNumber: "4111111111111111",
  expiryDate: "12/25",
  cvv: "123"
};

test.describe("E2E Purchase Flow", () => {
  
  /**
   * This test simulates a user purchasing a product from the e-commerce site. It covers the flow from selecting a product, adding it to the cart, proceeding to checkout, filling in shipping and payment details, and verifying the order success page.
   * The test currently fails because the shipping address form displays partially behind the menu bar on the default screen size 1280 x 720
   * The test cannot click on the shipping name input field because it is not fully visible, which causes the test to fail with an error indicating that the element is not interactable. 
   */
  test("User can purchase a product", async ({ page, ecommercePage, baseURL }) => {
    await ecommercePage.goto();
    if(!baseURL) {
      throw new Error("Base URL is not defined in the test configuration.");
    }
    
    // Select and add product to cart
    await expect(ecommercePage.productCardList.cards.first()).toBeVisible({timeout: 10000});
    const products = await ecommercePage.productCardList.getAllCards();
    const firstProduct = products[0];
    const productTitle = await firstProduct.getTitleText();
    
    await firstProduct.setQuantity(1);
    await firstProduct.addToCart();
    
    await ecommercePage.openCart();
    await expect(ecommercePage.proceedToBuyButton).toBeInViewport();

    //Proceed to checkout
    await ecommercePage.clickProceedToBuy();
    await expect(ecommercePage.shippingAddressModal.shippingNameInput).toBeInViewport();
    
    await ecommercePage.shippingAddressModal.fillShippingAddress(SHIPPING_ADDRESS);
    
    // Wait for any potential async validation to complete
    await ecommercePage.shippingAddressModal.clickSaveAddress();
    
    // Complete payment details
    await ecommercePage.paymentModal.fillPaymentDetails(PAYMENT_DETAILS);
    await expect(ecommercePage.paymentModal.buyNowButton).toBeInViewport();
    await ecommercePage.paymentModal.clickBuyNow();

    // Verify order success page is displayed
    await expect(ecommercePage.orderSuccessModal.orderSuccessHeading).toBeInViewport();
    await expect(ecommercePage.orderSuccessModal.orderSuccessMessage).toBeInViewport();
    
    // Verify the product is shown in the order
    const orderItemText = await ecommercePage.orderSuccessModal.getOrderItemText(0);
    expect(orderItemText).toContain(productTitle);
    
    await ecommercePage.orderSuccessModal.clickDone();
    
    //check page is redirected to home page
    await expect(ecommercePage.orderSuccessModal.orderSuccessHeading).not.toBeVisible();
    await expect(page).toHaveURL(baseURL);
  });
});
