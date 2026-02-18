import { test, expect } from "../fixtures";
import { Page } from "@playwright/test";
import path from "path";

const SCREENSHOT_STYLE_PATH = path.join(__dirname, 'visual-comparison.css');

/**
 * This test suite performs visual regression comparisons for the e-commerce page.
 * Uses a custom CSS stylesheet to hide images for consistent, deterministic screenshots.
 * This prevents flaky tests caused by image loading issues
 */
test.describe("Page Visual Comparisons", () => {
  test.beforeEach(async ({ ecommercePage }) => {
    await ecommercePage.goto();
  });

  test("ecommerce page - initial load", async ({ page, browserName }) => {
    // Wait for page to be stable
    await page.waitForLoadState('domcontentloaded');
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot(`ecommerce-initial-${browserName}.png`, {
      fullPage: true,
      maxDiffPixels: 100, // Allow minor rendering differences
      stylePath: SCREENSHOT_STYLE_PATH,
    });
  });

  test("ecommerce page - mobile viewport", async ({ page, browserName }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    
    // Take screenshot in mobile viewport
    await expect(page).toHaveScreenshot(`ecommerce-mobile-${browserName}.png`, {
      fullPage: true,
      maxDiffPixels: 100,
      stylePath: SCREENSHOT_STYLE_PATH,
    });
  });

  test("ecommerce page - tablet viewport", async ({ page, browserName }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    
    // Take screenshot in tablet viewport
    await expect(page).toHaveScreenshot(`ecommerce-tablet-${browserName}.png`, {
      fullPage: true,
      maxDiffPixels: 100,
      stylePath: SCREENSHOT_STYLE_PATH,
    });
  });
});

/**
 * Mock product data for consistent visual testing
 * Use this when the actual product list changes frequently
 */
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Laptop Pro 15",
    price: 1299.99,
    image: "https://via.placeholder.com/300x300/3498db/ffffff?text=Laptop+Pro",
    description: "High-performance laptop for professionals",
    category: "Electronics"
  },
  {
    id: 2,
    name: "Wireless Mouse",
    price: 29.99,
    image: "https://via.placeholder.com/300x300/2ecc71/ffffff?text=Mouse",
    description: "Ergonomic wireless mouse",
    category: "Accessories"
  },
  {
    id: 3,
    name: "USB-C Hub",
    price: 49.99,
    image: "https://via.placeholder.com/300x300/e74c3c/ffffff?text=USB+Hub",
    description: "7-in-1 USB-C hub with multiple ports",
    category: "Accessories"
  }
];

/**
 * EXAMPLE: Visual tests with mocked product data
 * Use this approach when products change frequently to ensure consistent screenshots
 */
test.describe("Page Visual Comparisons - With Mocked Data (Example)", () => {
  
  test.skip("ecommerce page with mocked products", async ({ page, ecommercePage, browserName }) => {
    // Intercept the API request and return mock data
    await page.route('**/api/products**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_PRODUCTS)
      });
    });

    // Mock search results API as well
    await page.route('**/api/search**', async (route) => {
      const url = new URL(route.request().url());
      const query = url.searchParams.get('q') || '';
      
      // Filter mock products based on search query
      const filteredProducts = MOCK_PRODUCTS.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(filteredProducts)
      });
    });

    // Now navigate to the page - it will use mocked data
    await ecommercePage.goto();
    await waitForAllImages(page, browserName);
    
    // Take consistent screenshot with mocked data
    await expect(page).toHaveScreenshot(`ecommerce-mocked-${browserName}.png`, {
      fullPage: true,
      maxDiffPixels: 50,
    });
  });
});

/**
 * Helper function to wait for all images to load completely
 * Handles lazy-loaded images by scrolling through the page
 */
async function waitForAllImages(page: Page, browserName?: string) {
  // First, ensure DOM is ready
  await page.waitForLoadState('domcontentloaded');
  
  // Scroll through page to trigger lazy-loaded images
  await page.evaluate(async () => {
    // Scroll to bottom in steps to trigger lazy loading
    const scrollHeight = document.body.scrollHeight;
    const viewportHeight = window.innerHeight;
    const steps = Math.ceil(scrollHeight / viewportHeight);
    
    for (let i = 0; i <= steps; i++) {
      window.scrollTo(0, i * viewportHeight);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Scroll back to top
    window.scrollTo(0, 0);
  });
  
  // Wait for all images to be fully loaded
  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images.every(img => img.complete && img.naturalHeight > 0);
  }, { timeout: 15000 });
  
  // WebKit sometimes needs extra time for rendering
  if (browserName === 'webkit') {
    await page.waitForTimeout(500);
  }
}
