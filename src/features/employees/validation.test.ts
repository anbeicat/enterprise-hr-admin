import { describe, expect, it } from "vitest";
import { findEmployeeConflict, validateEmployeeBatch } from "./validation";

const baseEmployee = {
    id: 1,
    employeeNo: "EMP001",
    name: "김민수",
    departmentName: "개발팀",
    position: "대리",
    email: "minsu@company.com",
    phone: "010-1234-5678",
    role: "EMPLOYEE" as const,
    status: "ACTIVE" as const,
    joinedAt: "2024-03-01",
};

describe("employee server validation", () => {
    it("rejects duplicate values during updates but excludes the current employee", () => {
        expect(findEmployeeConflict(baseEmployee, [baseEmployee], baseEmployee.id)).toBeNull();
        expect(findEmployeeConflict({ ...baseEmployee, employeeNo: "emp001" }, [baseEmployee])).toBe("이미 등록된 사번입니다.");
    });

    it("reports duplicate rows before an atomic batch import", () => {
        const incoming = [
            { ...baseEmployee, employeeNo: "EMP002", email: "new@company.com" },
            { ...baseEmployee, employeeNo: "emp002", email: "NEW@company.com" },
        ];
        const errors = validateEmployeeBatch(incoming, []);

        expect(errors).toEqual(["3행: 중복 사번, 중복 이메일"]);
    });
});
