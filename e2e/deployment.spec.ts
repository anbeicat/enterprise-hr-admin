import { expect, test } from "@playwright/test";

test("document metadata and crawler directives are production-ready", async ({ page, request }) => {
    await page.goto("/login");

    await expect(page.locator("html")).toHaveAttribute("lang", "ko");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        /기업 인사·근태·전자결재 백오피스/,
    );
    await expect(page).toHaveTitle("기업 인사·근태 관리 시스템");

    const robotsResponse = await request.get("/robots.txt");
    expect(robotsResponse.ok()).toBe(true);
    expect(robotsResponse.headers()["content-type"]).toContain("text/plain");
    expect(await robotsResponse.text()).toContain("Allow: /");
});
