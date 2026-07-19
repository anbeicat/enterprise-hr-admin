import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { login } from "./helpers";

const ADMIN_BUSINESS_ROUTES = [
    "/system/departments",
    "/system/roles",
    "/system/menus",
    "/system/dictionaries",
    "/requests/leave",
    "/requests/overtime",
    "/requests/business-trip",
    "/approvals/pending",
    "/approvals/my-requests",
    "/approvals/history",
    "/attendance/status",
    "/attendance/monthly",
    "/notices",
    "/logs/audit",
    "/logs/login",
] as const;

async function expectNoAccessibilityViolations(page: Page, include?: string) {
    let builder = new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        // WCAG 1.4.3 explicitly exempts inactive UI controls from contrast requirements.
        .exclude("button:disabled")
        .exclude("button:disabled *");
    if (include) builder = builder.include(include);
    const { violations } = await builder.analyze();

    const summary = violations.map(({ id, impact, help, nodes }) => ({
        id,
        impact,
        help,
        nodes: nodes.map((node) => ({
            target: node.target,
            html: node.html,
            failureSummary: node.failureSummary,
        })),
    }));

    expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
}

async function waitForAnimations(locator: Locator) {
    await locator.evaluate(async (element) => {
        await Promise.all(
            element.getAnimations({ subtree: true }).map((animation) => animation.finished.catch(() => undefined)),
        );
    });
}

test("login page has no detectable WCAG A or AA violations", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "인사·근태 관리 시스템" })).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
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
    await waitForAnimations(dialog);
    await expectNoAccessibilityViolations(page, ".ant-modal");
});

test("admin business pages have no detectable WCAG A or AA violations", async ({ page }) => {
    test.setTimeout(120_000);

    await login(page);

    for (const path of ADMIN_BUSINESS_ROUTES) {
        await test.step(path, async () => {
            await page.goto(path);
            await expect(page).toHaveURL(new RegExp(`${path.replaceAll("/", "\\/")}$`));
            const main = page.locator("main");
            await expect(main).toBeVisible();
            await expect(page.locator(".ant-spin-fullscreen")).toHaveCount(0);
            await expect(page.locator("main .ant-spin-spinning")).toHaveCount(0);
            await waitForAnimations(main);
            await expectNoAccessibilityViolations(page, "main");
        });
    }
});
