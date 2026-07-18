import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test("visited tabs persist, close correctly and reveal the active tab", async ({ page }) => {
    test.setTimeout(120_000);

    await login(page);
    const routes = [
        ["/system/employees", "직원 관리"],
        ["/system/departments", "조직 관리"],
        ["/system/roles", "역할 관리"],
        ["/system/menus", "메뉴 관리"],
        ["/system/dictionaries", "코드 관리"],
        ["/requests/leave", "휴가 신청"],
        ["/requests/overtime", "연장근무 신청"],
        ["/requests/business-trip", "출장 신청"],
        ["/approvals/pending", "결재 대기함"],
        ["/approvals/my-requests", "내 신청함"],
        ["/approvals/history", "결재 이력"],
        ["/attendance/status", "근태 현황"],
        ["/attendance/monthly", "월별 통계"],
        ["/notices", "공지사항"],
    ];
    const tagsView = page.locator(".tags-scroll");
    for (const [route, title] of routes) {
        await page.goto(route);
        await expect(tagsView.getByTitle(title)).toHaveCount(1);
    }

    const activeTab = tagsView.getByTitle("공지사항");
    await expect(activeTab).toBeVisible();
    const [containerBox, activeBox] = await Promise.all([tagsView.boundingBox(), activeTab.boundingBox()]);
    expect(containerBox).not.toBeNull();
    expect(activeBox).not.toBeNull();
    expect(activeBox!.x).toBeGreaterThanOrEqual(containerBox!.x - 1);
    expect(activeBox!.x + activeBox!.width).toBeLessThanOrEqual(containerBox!.x + containerBox!.width + 1);

    await page.reload();
    await expect(tagsView.getByTitle("직원 관리")).toHaveCount(1);
    await expect(tagsView.getByTitle("공지사항")).toHaveCount(1);

    await tagsView.getByRole("button", { name: "공지사항 닫기" }).click();
    await expect(page).toHaveURL(/\/attendance\/monthly$/);
    await expect(tagsView.getByTitle("공지사항")).toHaveCount(0);
});
