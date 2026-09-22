import puppeteer, { Browser, Page } from "puppeteer";

async function runGoogleSearchTest(): Promise<void> {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    console.log("🚀 Iniciando prueba demo de búsqueda en Google...");

    // Lanzar navegador
    browser = await puppeteer.launch({
      headless: false, // Poner en true para modo headless
      defaultViewport: { width: 1280, height: 720 },
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    page = await browser.newPage();

    // Navegar a Google
    console.log("📍 Navegando a Google...");
    await page.goto("https://www.google.com", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Aceptar cookies si aparece el diálogo
    try {
      await page.waitForSelector('[aria-label="Accept all"]', {
        timeout: 3000,
      });
      await page.click('[aria-label="Accept all"]');
      console.log("✅ Cookies aceptadas");
    } catch (error) {
      console.log("ℹ️  No se encontró diálogo de cookies o ya estaba aceptado");
    }

    // Buscar "Puppeteer"
    console.log("🔍 Realizando búsqueda...");
    const searchSelector = 'textarea[name="q"], input[name="q"]';
    await page.waitForSelector(searchSelector);
    await page.type(searchSelector, "Puppeteer automation");
    await page.keyboard.press("Enter");

    // Esperar resultados de búsqueda
    await page.waitForSelector("#search", { timeout: 10000 });
    console.log("✅ Resultados de búsqueda cargados");

    // Tomar una captura de pantalla
    await page.screenshot({
      path: "./search-results.png",
      fullPage: true,
    });
    console.log("📸 Captura de pantalla guardada como search-results.png");

    // Obtener el título del primer resultado de búsqueda
    const firstResultTitle = await page.$eval(
      "h3",
      (element) => element.textContent || "No title found"
    );
    console.log(`🎯 Título del primer resultado: "${firstResultTitle}"`);

    // Verificar que obtuvimos resultados
    const resultsCount = await page.$$eval(
      "[data-ved] h3",
      (elements) => elements.length
    );
    console.log(`📊 Se encontraron ${resultsCount} resultados de búsqueda`);

    if (resultsCount > 0) {
      console.log("✅ Prueba EXITOSA: Se encontraron resultados de búsqueda");
    } else {
      throw new Error("❌ Prueba FALLIDA: No se encontraron resultados de búsqueda");
    }
  } catch (error) {
    console.error("❌ La prueba falló con error:", error);
    throw error;
  } finally {
    // Limpieza
    if (page) {
      await page.close();
    }
    if (browser) {
      await browser.close();
    }
    console.log("🧹 Limpieza del navegador completada");
  }
}

// Ejecutar la prueba si este archivo se ejecuta directamente
if (require.main === module) {
  runGoogleSearchTest()
    .then(() => {
      console.log("🎉 ¡Prueba demo completada exitosamente!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Prueba demo falló:", error);
      process.exit(1);
    });
}

export { runGoogleSearchTest };
