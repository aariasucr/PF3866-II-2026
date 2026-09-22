import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("https://www.ucr.ac.cr/");
  await expect(
    page.getByRole("link", { name: "Universidad de Costa Rica" }),
  ).toBeVisible();
  await page
    .getByText(
      "Universidad de Costa Rica Acciones AccesibilidadIdiomasIngresarSalirBuscar Menu",
    )
    .click();
  //Click para abrir el menú de navegación
  await page.getByRole("menuitem", { name: "Docencia" }).click();
  // Click en la opcion Docencia dentro de Docencia
  await page.getByRole("menuitem", { name: "Docencia" }).click();
  await expect(page.locator("h1")).toContainText("Docencia en la UCR");
  await expect(
    page.getByRole("link", { name: "Mediación Virtual" }),
  ).toBeVisible();
});
