import { test, expect } from "@playwright/test";

test.describe("Example Demo Tests", () => {
  test("has title", async ({ page }) => {
    await page.goto("https://playwright.dev/");

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Playwright/);
  });

  test("get started link", async ({ page }) => {
    await page.goto("https://playwright.dev/");

    // Click the get started link.
    await page.getByRole("link", { name: "Get started" }).click();

    // Expects page to have a heading with the name of Installation.
    await expect(
      page.getByRole("heading", { name: "Installation" }),
    ).toBeVisible();
  });

  test("search functionality", async ({ page }) => {
    await page.goto("https://playwright.dev/");

    // Click on search button
    await page.getByRole("button", { name: "Search" }).click();

    // Type in search box
    await page.getByPlaceholder("Search docs").fill("test");

    // Wait for search results
    await expect(page.getByText("Test generator")).toBeVisible();
  });
});
