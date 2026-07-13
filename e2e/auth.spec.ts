import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test("administrator can log in and reach the dashboard", async ({ page }) => {
    await login(page);
    await expect(page.getByText("admin", { exact: true })).toBeVisible();
    await expect(page.getByText("관리자", { exact: true })).toBeVisible();
});

test("employee is redirected from an unauthorized system route", async ({ page }) => {
    await login(page, "employee");
    await page.goto("/system/employees");
    await expect(page).toHaveURL(/\/403$/);
    await expect(page.getByText("이 페이지에 접근할 권한이 없습니다.")).toBeVisible();
});
