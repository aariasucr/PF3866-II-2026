import { runGoogleSearchTest } from "./demo-google-search";
import { runFormInteractionTest } from "./demo-form-interaction";
import { runAccessibilityTest } from "./demo-accessibility-test";

interface TestResult {
  name: string;
  status: "PASSED" | "FAILED";
  error?: Error;
  duration: number;
}

async function runAllTests(): Promise<void> {
  const tests = [
    { name: "Google Search Test", testFunction: runGoogleSearchTest },
    { name: "Form Interaction Test", testFunction: runFormInteractionTest },
    { name: "Accessibility Test", testFunction: runAccessibilityTest },
  ];

  const results: TestResult[] = [];

  console.log("🧪 Starting E2E Test Suite...");
  console.log("=".repeat(50));

  for (const test of tests) {
    console.log(`\n🔄 Running: ${test.name}`);
    const startTime = Date.now();

    try {
      await test.testFunction();
      const duration = Date.now() - startTime;
      results.push({
        name: test.name,
        status: "PASSED",
        duration,
      });
      console.log(`✅ ${test.name} PASSED (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      results.push({
        name: test.name,
        status: "FAILED",
        error: error as Error,
        duration,
      });
      console.error(`❌ ${test.name} FAILED (${duration}ms):`, error);
    }
  }

  // Print summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(50));

  const passed = results.filter((r) => r.status === "PASSED").length;
  const failed = results.filter((r) => r.status === "FAILED").length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  results.forEach((result) => {
    const statusIcon = result.status === "PASSED" ? "✅" : "❌";
    console.log(
      `${statusIcon} ${result.name}: ${result.status} (${result.duration}ms)`
    );
    if (result.error) {
      console.log(`   Error: ${result.error.message}`);
    }
  });

  console.log("\n" + "-".repeat(30));
  console.log(`📈 Total Tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏱️  Total Duration: ${totalDuration}ms`);
  console.log("-".repeat(30));

  if (failed > 0) {
    console.log(`\n💥 ${failed} test(s) failed!`);
    process.exit(1);
  } else {
    console.log("\n🎉 All tests passed!");
    process.exit(0);
  }
}

// Run all tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch((error) => {
    console.error("💥 Test suite failed:", error);
    process.exit(1);
  });
}

export { runAllTests };
