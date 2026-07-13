import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { login } from "./helpers";

async function expectNoAccessibilityViolations(page: Page, include?: string) {
    let builder = new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]);
    if (include) builder = builder.include(include);
    const { violations } = await builder.analyze();

    const summary = violations.map(({ id, impact, help, nodes }) => ({
        id,
        impact,
        help,
        targets: nodes.map((node) => node.target),
    }));

    expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
}

test("login page has no detectable WCAG A or AA violations", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "인사·근태 관리 시스템" })).toBeVisible();
    await expect(page.locator(".ant-spin-fullscreen")).toHaveCount(0);
    await expectNoAccessibilityViolations(page);
});

test("dashboard has no detectable WCAG A or AA violations", async ({ page }) => {
    await login(page);
    await expect(page.locator(".ant-spin-fullscreen")).toHaveCount(0);
    await expectNoAccessibilityViolations(page);
});

test("employee form has no detectable WCAG A or AA violations", async ({ page }) => {
    await login(page);
    await page.goto("/system/employees");
    await expect(page.locator("tbody tr").first()).toBeVisible();
    await expectNoAccessibilityViolations(page, "main");
    await page.getByRole("button", { name: /등록/ }).click();
    const dialog = page.getByRole("dialog", { name: "직원 등록" });
    await expect(dialog).toBeVisible();
    await dialog.evaluate(async (element) => {
        await Promise.all(
            element.getAnimations({ subtree: true }).map((animation) => animation.finished.catch(() => undefined)),
        );
    });
    await expectNoAccessibilityViolations(page, ".ant-modal");
});
