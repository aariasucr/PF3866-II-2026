import { test, expect } from "@playwright/test";

test.describe("Form Interaction Tests", () => {
  test("form submission demo", async ({ page }) => {
    await page.goto("https://demo.playwright.dev/todomvc");

    // Add a new todo item
    const todoInput = page.getByPlaceholder("What needs to be done?");
    await todoInput.fill("Learn Playwright");
    await todoInput.press("Enter");

    // Verify the todo was added
    await expect(page.getByTestId("todo-title")).toHaveText("Learn Playwright");

    // Add another todo
    await todoInput.fill("Write e2e tests");
    await todoInput.press("Enter");

    // Check that we have 2 todos
    await expect(page.getByTestId("todo-item")).toHaveCount(2);

    // Mark first todo as completed
    await page.getByTestId("todo-item").first().getByRole("checkbox").check();

    // Verify it's marked as completed
    await expect(page.getByTestId("todo-item").first()).toHaveClass(
      /completed/,
    );

    // Filter to show only active todos
    await page.getByRole("link", { name: "Active" }).click();

    // Should only see 1 active todo
    await expect(page.getByTestId("todo-item")).toHaveCount(1);
    await expect(page.getByTestId("todo-title")).toHaveText("Write e2e tests");
  });

  test("input validation demo", async ({ page }) => {
    await page.goto("https://demo.playwright.dev/todomvc");

    const todoInput = page.getByPlaceholder("What needs to be done?");

    // Try to submit empty todo (should not create one)
    await todoInput.press("Enter");
    await expect(page.getByTestId("todo-item")).toHaveCount(0);

    // Add a todo with just spaces (should be trimmed)
    await todoInput.fill("   Valid todo   ");
    await todoInput.press("Enter");

    await expect(page.getByTestId("todo-title")).toHaveText("Valid todo");
  });
});
