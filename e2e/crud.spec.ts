import { expect, test, type Locator, type Page } from "@playwright/test";
import { login } from "./helpers";

async function selectOption(page: Page, field: Locator, option: string) {
    await field.click();
    await page
        .locator(".ant-select-dropdown:visible .ant-select-item-option-content")
        .filter({ hasText: option })
        .click();
}

test("administrator can create, update and delete an employee", async ({ page }) => {
    await login(page);
    await page.goto("/system/employees");
    await page.getByRole("button", { name: /등록/ }).click();

    const createDialog = page.getByRole("dialog", { name: "직원 등록" });
    await createDialog.getByPlaceholder("예: EMP004").fill("EMP900");
    await createDialog.getByPlaceholder("이름을 입력하세요").fill("테스트직원");
    await selectOption(page, createDialog.getByRole("combobox", { name: "부서", exact: true }), "개발팀");
    await selectOption(page, createDialog.getByRole("combobox", { name: "직급", exact: true }), "사원");
    await createDialog.getByPlaceholder("email@company.com").fill("e2e900@company.com");
    await createDialog.getByPlaceholder("010-0000-0000").fill("010-9000-0000");
    await selectOption(page, createDialog.getByRole("combobox", { name: "권한", exact: true }), "일반 직원");
    await selectOption(page, createDialog.getByRole("combobox", { name: "재직상태", exact: true }), "재직");
    const joinedAt = createDialog.getByPlaceholder("입사일 선택");
    await joinedAt.fill("2026-07-01");
    await joinedAt.press("Enter");
    await createDialog.getByRole("button", { name: "확인", exact: true }).click();

    await expect(page.getByText("직원이 등록되었습니다.")).toBeVisible();
    let employeeRow = page.locator("tbody tr").filter({ hasText: "EMP900" });
    await expect(employeeRow).toContainText("테스트직원");

    await employeeRow.getByRole("button", { name: "수정", exact: true }).click();
    const editDialog = page.getByRole("dialog", { name: "직원 수정" });
    await editDialog.getByPlaceholder("이름을 입력하세요").fill("수정직원");
    await editDialog.getByRole("button", { name: "확인", exact: true }).click();
    await expect(page.getByText("직원 정보가 수정되었습니다.")).toBeVisible();
    employeeRow = page.locator("tbody tr").filter({ hasText: "EMP900" });
    await expect(employeeRow).toContainText("수정직원");

    await employeeRow.getByRole("button", { name: "삭제", exact: true }).click();
    await page.locator(".ant-popconfirm").getByRole("button", { name: "삭제", exact: true }).click();
    await expect(page.getByText("직원이 삭제되었습니다.")).toBeVisible();
    await expect(page.locator("tbody tr").filter({ hasText: "EMP900" })).toHaveCount(0);
});

test("employee can submit and withdraw a leave request", async ({ page }) => {
    await login(page, "employee");
    await page.goto("/requests/leave");
    await page.locator("main").getByRole("button", { name: /휴가 신청$/ }).click();

    const requestDialog = page.getByRole("dialog", { name: "휴가 신청" });
    await requestDialog.getByLabel("제목").fill("E2E 휴가 신청");
    const dateInputs = requestDialog.locator(".ant-picker-input input");
    await dateInputs.nth(0).fill("2026-08-03");
    await dateInputs.nth(1).fill("2026-08-04");
    await requestDialog.getByPlaceholder("예: 1일").fill("2일");
    await requestDialog.getByLabel("신청 사유").fill("E2E 업무 흐름 검증");
    await requestDialog.getByRole("button", { name: "신청", exact: true }).click();

    await expect(page.getByText("신청이 제출되었습니다.")).toBeVisible();
    await expect(page.locator("tbody tr").filter({ hasText: "E2E 휴가 신청" })).toBeVisible();

    await page.goto("/approvals/my-requests");
    const requestRow = page.locator("tbody tr").filter({ hasText: "E2E 휴가 신청" });
    await requestRow.getByRole("button", { name: "상세", exact: true }).click();
    await page.getByRole("button", { name: "신청 철회", exact: true }).click();
    await page.locator(".ant-popconfirm").getByRole("button", { name: "철회", exact: true }).click();

    await expect(page.getByText("신청이 철회되었습니다.")).toBeVisible();
    await expect(page.locator("tbody tr").filter({ hasText: "E2E 휴가 신청" })).toContainText("취소");
});
