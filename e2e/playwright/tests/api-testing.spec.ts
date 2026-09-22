import { test, expect } from "@playwright/test";

test.describe("API Testing Demo", () => {
  test("API response validation", async ({ request }) => {
    // Test a public API endpoint
    const response = await request.get(
      "https://jsonplaceholder.typicode.com/posts/1",
    );

    // Validate response status
    expect(response.status()).toBe(200);

    // Validate response headers
    expect(response.headers()["content-type"]).toContain("application/json");

    // Validate response body
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("id", 1);
    expect(responseBody).toHaveProperty("userId", 1);
    expect(responseBody).toHaveProperty("title");
    expect(responseBody).toHaveProperty("body");
    expect(typeof responseBody.title).toBe("string");
    expect(responseBody.title.length).toBeGreaterThan(0);
  });

  test("API POST request", async ({ request }) => {
    const newPost = {
      title: "Test Post",
      body: "This is a test post created by Playwright",
      userId: 1,
    };

    const response = await request.post(
      "https://jsonplaceholder.typicode.com/posts",
      {
        data: newPost,
      },
    );

    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("id");
    expect(responseBody.title).toBe(newPost.title);
    expect(responseBody.body).toBe(newPost.body);
    expect(responseBody.userId).toBe(newPost.userId);
  });

  test("API error handling", async ({ request }) => {
    // Test with invalid endpoint
    const response = await request.get(
      "https://jsonplaceholder.typicode.com/posts/999999",
    );

    // This API returns 404 for non-existent resources
    expect(response.status()).toBe(404);

    const responseBody = await response.json();
    expect(Object.keys(responseBody)).toHaveLength(0);
  });
});
