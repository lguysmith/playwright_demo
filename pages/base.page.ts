import { Page, Response } from "@playwright/test";
/**
 * BasePage serves as a foundational class for all page objects in the application.
 * It encapsulates common properties and methods that can be shared across different pages.
 * This promotes code reuse and maintains consistency in how pages are handled.
 */
export abstract class BasePage {
  protected page: Page;
  /**
   * The relative URL of the page.
   */
  abstract readonly url: string;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(): Promise<Response | null> {
    return await this.page.goto(this.url);
  }

  /**
   * Get the full URL of the current page by combining the baseURL with the page's relative URL.
   * @param baseURL
   * @returns The full URL as a string.
   * @throws Error if baseURL is not defined.
   */
  async getFullURL(baseURL: string | undefined): Promise<string> {
    if (!baseURL) {
      throw new Error("Base URL is not defined when getting full URL");
    }
    return new URL(this.page.url(), baseURL).href;
  }
}
