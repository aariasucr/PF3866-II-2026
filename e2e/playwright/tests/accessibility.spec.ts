import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Pruebas de Accesibilidad", () => {
  test("should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    await page.goto("https://playwright.dev/");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should not have accessibility violations on demo todo app", async ({
    page,
  }) => {
    await page.goto("https://demo.playwright.dev/todomvc");

    // Agregar contenido de prueba
    await page
      .getByPlaceholder("What needs to be done?")
      .fill("Test todo item");
    await page.getByPlaceholder("What needs to be done?").press("Enter");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should pass WCAG 2.1 Level AA accessibility standards", async ({
    page,
  }) => {
    await page.goto("https://playwright.dev/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should exclude specific elements from accessibility scan", async ({
    page,
  }) => {
    await page.goto("https://playwright.dev/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .exclude("#some-problematic-element") // Ejemplo de exclusión de elementos
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should only scan specific regions", async ({ page }) => {
    await page.goto("https://playwright.dev/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include("main") // Solo escanear el área de contenido principal
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should check for specific accessibility rules", async ({ page }) => {
    await page.goto("https://playwright.dev/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["color-contrast", "image-alt", "label", "link-name"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should provide detailed violation information", async ({ page }) => {
    await page.goto("https://demo.playwright.dev/todomvc");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    // Si hay violaciones, esta prueba mostrará información detallada
    if (accessibilityScanResults.violations.length > 0) {
      console.log("Accessibility violations found:");
      accessibilityScanResults.violations.forEach((violation) => {
        console.log(`- ${violation.id}: ${violation.description}`);
        console.log(`  Impact: ${violation.impact}`);
        console.log(`  Help: ${violation.help}`);
        console.log(`  Help URL: ${violation.helpUrl}`);
        violation.nodes.forEach((node) => {
          console.log(`  Element: ${node.target}`);
          console.log(`  HTML: ${node.html}`);
        });
      });
    }

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should test accessibility on form interactions", async ({ page }) => {
    await page.goto("https://demo.playwright.dev/todomvc");

    // Probar estado inicial
    let accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);

    // Agregar un todo y probar de nuevo
    await page
      .getByPlaceholder("What needs to be done?")
      .fill("Learn accessibility testing");
    await page.getByPlaceholder("What needs to be done?").press("Enter");

    accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);

    // Marcar todo como completado y probar de nuevo
    await page.getByTestId("todo-item").first().getByRole("checkbox").check();

    accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should test accessibility with different viewport sizes", async ({
    page,
  }) => {
    // Probar viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("https://playwright.dev/");

    let accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);

    // Probar viewport de escritorio
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();

    accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should test keyboard navigation accessibility", async ({ page }) => {
    await page.goto("https://playwright.dev/");

    // Probar que la página sea accesible vía navegación con teclado
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    // Verificar accesibilidad después de interacción con teclado
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
