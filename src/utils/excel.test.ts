import { describe, expect, it } from "vitest";
import { buildEmployeeWorkbook, normalizeExcelDate, parseEmployeeWorkbook } from "./excel";

const employee = {
    employeeNo: "EMP900",
    name: "테스트 사용자",
    departmentName: "개발팀",
    position: "사원",
    email: "test900@company.com",
    phone: "010-9000-0000",
    role: "EMPLOYEE" as const,
    status: "ACTIVE" as const,
    joinedAt: "2026-07-11",
};

describe("employee Excel workbook", () => {
    it("normalizes native Excel dates and common Korean spreadsheet styles", () => {
        expect(normalizeExcelDate(new Date(2023, 10, 11))).toBe("2023-11-11");
        expect(normalizeExcelDate("2023/11/11")).toBe("2023-11-11");
        expect(normalizeExcelDate("2023.11.11")).toBe("2023-11-11");
        expect(normalizeExcelDate("2023-2-3")).toBe("2023-02-03");
        expect(normalizeExcelDate("2023-02-30")).toBeNull();
    });

    it("round-trips employee rows through xlsx", async () => {
        const bytes = await buildEmployeeWorkbook([employee]);
        const result = await parseEmployeeWorkbook(bytes.buffer as ArrayBuffer, []);

        expect(result.errors).toEqual([]);
        expect(result.employees).toEqual([employee]);
    });

    it("rejects employee numbers and emails that already exist", async () => {
        const bytes = await buildEmployeeWorkbook([employee]);
        const result = await parseEmployeeWorkbook(bytes.buffer as ArrayBuffer, [{ id: 1, ...employee }]);

        expect(result.employees).toEqual([]);
        expect(result.errors[0]).toContain("중복 사번");
        expect(result.errors[0]).toContain("중복 이메일");
    });
});
