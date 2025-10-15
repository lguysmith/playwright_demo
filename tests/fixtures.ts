import { test as base, Page } from "@playwright/test";
import { EcommercePage } from "../pages/ecommerce.page"; // import your page object

/**
 * Define custom fixtures for pages
 * This allows you to create instances of your page objects without repeating code in each test file to instantiate them.
 */
type Fixtures = {
  ecommercePage: EcommercePage;
};

// Custom page fixtures
export const test = base.extend<Fixtures>({
  ecommercePage: async ({ page }, use) => {
    const ecommercePage = new EcommercePage(page);
    await use(ecommercePage);
  },
});
export { expect } from "@playwright/test";
