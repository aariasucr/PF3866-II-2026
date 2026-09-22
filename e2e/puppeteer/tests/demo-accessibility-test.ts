import puppeteer, { Browser, Page } from "puppeteer";
import { AxePuppeteer } from "@axe-core/puppeteer";

interface AccessibilityViolation {
  id: string;
  impact: string;
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    target: string[];
    html: string;
    failureSummary: string;
  }>;
}

async function runAccessibilityTest(): Promise<void> {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    console.log("🚀 Starting accessibility test with axe-core...");

    // Launch browser
    browser = await puppeteer.launch({
      headless: false, // Set to true for headless mode
      defaultViewport: { width: 1280, height: 720 },
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    page = await browser.newPage();

    // Test multiple websites for accessibility
    const testUrls = [
      {
        name: "Wikipedia Homepage",
        url: "https://en.wikipedia.org/wiki/Main_Page",
      },
      {
        name: "GitHub Homepage",
        url: "https://github.com",
      },
      {
        name: "MDN Web Docs",
        url: "https://developer.mozilla.org/en-US/",
      },
      {
        name: "UCR",
        url: "https://www.ucr.ac.cr/",
      },
    ];

    let totalViolations = 0;
    const results: Array<{
      name: string;
      url: string;
      violations: AccessibilityViolation[];
      passed: boolean;
    }> = [];

    for (const testSite of testUrls) {
      console.log(`\n📍 Testing accessibility for: ${testSite.name}`);
      console.log(`🌐 URL: ${testSite.url}`);

      try {
        // Navigate to the page
        await page.goto(testSite.url, {
          waitUntil: "networkidle2",
          timeout: 30000,
        });

        // Run axe accessibility analysis
        console.log("🔍 Running axe-core accessibility analysis...");
        const axeResults = await new AxePuppeteer(page)
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();

        const violations = axeResults.violations as AccessibilityViolation[];
        totalViolations += violations.length;

        // Take a screenshot
        await page.screenshot({
          path: `./accessibility-${testSite.name
            .toLowerCase()
            .replace(/\s+/g, "-")}.png`,
          fullPage: false,
        });

        console.log(`📊 Found ${violations.length} accessibility violations`);

        // Log violations with details
        if (violations.length > 0) {
          console.log("❌ Accessibility violations found:");
          violations.forEach((violation, index) => {
            console.log(
              `\n  ${index + 1}. ${violation.id} (${violation.impact})`
            );
            console.log(`     Description: ${violation.description}`);
            console.log(`     Help: ${violation.help}`);
            console.log(`     Help URL: ${violation.helpUrl}`);
            console.log(`     Affected elements: ${violation.nodes.length}`);

            // Log first few affected elements
            violation.nodes.slice(0, 3).forEach((node, nodeIndex) => {
              console.log(
                `       ${nodeIndex + 1}. Target: ${node.target.join(" > ")}`
              );
              console.log(
                `          HTML: ${node.html.substring(0, 100)}${
                  node.html.length > 100 ? "..." : ""
                }`
              );
            });
          });
        } else {
          console.log("✅ No accessibility violations found!");
        }

        results.push({
          name: testSite.name,
          url: testSite.url,
          violations,
          passed: violations.length === 0,
        });
      } catch (error) {
        console.error(`❌ Error testing ${testSite.name}:`, error);
        results.push({
          name: testSite.name,
          url: testSite.url,
          violations: [],
          passed: false,
        });
      }

      // Wait a bit between tests
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // Print summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 ACCESSIBILITY TEST SUMMARY");
    console.log("=".repeat(60));

    results.forEach((result) => {
      const statusIcon = result.passed ? "✅" : "❌";
      console.log(
        `${statusIcon} ${result.name}: ${result.violations.length} violations`
      );
    });

    const passedTests = results.filter((r) => r.passed).length;
    const failedTests = results.filter((r) => !r.passed).length;

    console.log("\n" + "-".repeat(40));
    console.log(`📈 Total Sites Tested: ${results.length}`);
    console.log(`✅ Sites with No Violations: ${passedTests}`);
    console.log(`❌ Sites with Violations: ${failedTests}`);
    console.log(`🚨 Total Violations Found: ${totalViolations}`);
    console.log("-".repeat(40));

    // Create a detailed report
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        totalSites: results.length,
        sitesWithNoViolations: passedTests,
        sitesWithViolations: failedTests,
        totalViolations,
      },
      results,
    };

    // Save report to JSON file
    const fs = require("fs");
    fs.writeFileSync(
      "./accessibility-report.json",
      JSON.stringify(reportData, null, 2)
    );
    console.log("📄 Detailed report saved as accessibility-report.json");

    if (totalViolations === 0) {
      console.log("\n🎉 All sites passed accessibility tests!");
    } else {
      console.log(
        `\n⚠️  Found ${totalViolations} accessibility issues across ${failedTests} sites`
      );
      console.log(
        "💡 Check the detailed report and screenshots for more information"
      );
    }
  } catch (error) {
    console.error("❌ Accessibility test failed with error:", error);

    // Take a screenshot on error
    if (page) {
      await page.screenshot({
        path: "./accessibility-error.png",
        fullPage: true,
      });
      console.log("📸 Error screenshot saved as accessibility-error.png");
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
  runAccessibilityTest()
    .then(() => {
      console.log("🎉 Accessibility test completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Accessibility test failed:", error);
      process.exit(1);
    });
}

export { runAccessibilityTest };
