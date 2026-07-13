import { expect, type Page } from "@playwright/test";

export async function login(page: Page, username = "admin") {
    await page.goto("/login");
    await page.getByPlaceholder("아이디").fill(username);
    await page.getByPlaceholder("비밀번호").fill("123456");
    await page.getByPlaceholder("인증번호").fill("1");
    await page.getByRole("button", { name: "로그인", exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
}
