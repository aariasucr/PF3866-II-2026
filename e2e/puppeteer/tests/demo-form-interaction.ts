import puppeteer, { Browser, Page } from "puppeteer";

async function runFormInteractionTest(): Promise<void> {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    console.log("🚀 Starting form interaction demo test...");

    // Launch browser
    browser = await puppeteer.launch({
      headless: false, // Set to true for headless mode
      defaultViewport: { width: 1280, height: 720 },
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    page = await browser.newPage();

    // Navigate to a demo form page (using httpbin.org for testing)
    console.log("📍 Navigating to test form...");
    await page.goto("https://httpbin.org/forms/post", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    console.log("✅ Form page loaded");

    // Fill out the form
    console.log("📝 Filling out form fields...");

    // Fill customer name
    await page.waitForSelector('input[name="custname"]');
    await page.type('input[name="custname"]', "John Doe");
    console.log("✅ Customer name filled");

    // Fill telephone
    await page.type('input[name="custtel"]', "+1-555-123-4567");
    console.log("✅ Telephone filled");

    // Fill email
    await page.type('input[name="custemail"]', "john.doe@example.com");
    console.log("✅ Email filled");

    // Select pizza size (Large)
    await page.select('select[name="size"]', "large");
    console.log("✅ Pizza size selected");

    // Select toppings (checkboxes)
    await page.click('input[name="topping"][value="bacon"]');
    await page.click('input[name="topping"][value="cheese"]');
    console.log("✅ Toppings selected");

    // Fill delivery time
    await page.type('input[name="delivery"]', "19:00");
    console.log("✅ Delivery time filled");

    // Fill comments
    await page.type(
      'textarea[name="comments"]',
      "Please ring the doorbell twice. Thank you!"
    );
    console.log("✅ Comments filled");

    // Take a screenshot before submitting
    await page.screenshot({
      path: "./form-before-submit.png",
      fullPage: true,
    });
    console.log("📸 Screenshot saved as form-before-submit.png");

    // Submit the form
    console.log("🚀 Submitting form...");
    await page.click('input[type="submit"]');

    // Wait for the response page
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    console.log("✅ Form submitted successfully");

    // Verify we're on the success page
    const currentUrl = page.url();
    if (currentUrl.includes("httpbin.org")) {
      console.log("✅ Redirected to response page");

      // Take a screenshot of the response
      await page.screenshot({
        path: "./form-response.png",
        fullPage: true,
      });
      console.log("📸 Response screenshot saved as form-response.png");

      // Extract and log the response data
      const responseText = await page.evaluate(() => {
        const preElement = document.querySelector("pre");
        return preElement ? preElement.textContent : "No response data found";
      });

      console.log("📊 Form submission response:");
      console.log(responseText);

      console.log("✅ Test PASSED: Form submitted and response received");
    } else {
      throw new Error("❌ Test FAILED: Unexpected redirect URL");
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error);

    // Take a screenshot on error
    if (page) {
      await page.screenshot({
        path: "./form-error.png",
        fullPage: true,
      });
      console.log("📸 Error screenshot saved as form-error.png");
    }

    throw error;
  } finally {
    // Cleanup
    if (page) {
      await page.close();
    }
    if (browser) {
      await browser.close();
    }
    console.log("🧹 Browser cleanup completed");
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  runFormInteractionTest()
    .then(() => {
      console.log("🎉 Form interaction demo test completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Form interaction demo test failed:", error);
      process.exit(1);
    });
}

export { runFormInteractionTest };
