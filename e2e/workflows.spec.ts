import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test("administrator can search the employee list", async ({ page }) => {
    await login(page);
    await page.goto("/system/employees");
    await page.getByPlaceholder("사번을 입력하세요").fill("EMP001");
    await page.locator("form").getByRole("button", { name: /검색/ }).click();
    await expect(page.locator("tbody").getByText("EMP001", { exact: true })).toBeVisible();
    await expect(page.locator("tbody").getByText("EMP002", { exact: true })).toHaveCount(0);
});

test("department manager can approve a pending request", async ({ page }) => {
    await login(page, "manager");
    await page.goto("/approvals/pending");
    const requestRow = page.locator("tbody tr").filter({ hasText: "LV-2026-001" });
    await requestRow.getByRole("button", { name: "상세" }).click();
    await page.getByPlaceholder("승인 또는 반려 의견을 입력하세요").fill("일정 확인 완료");
    await page.getByRole("button", { name: "승인", exact: true }).click();
    await expect(page.getByText("승인 처리되었습니다.")).toBeVisible();
    await page.goto("/approvals/history");
    const approvedRow = page.locator("tbody tr").filter({ hasText: "LV-2026-001" });
    await expect(approvedRow).toContainText("승인");
});
