import type { Employee } from "./types";
import type { EmployeePayload } from "./api";

export function findEmployeeConflict(
    values: EmployeePayload,
    existingEmployees: Employee[],
    excludeId?: number,
) {
    const candidates = existingEmployees.filter((item) => item.id !== excludeId);
    if (candidates.some((item) => item.employeeNo.toLowerCase() === values.employeeNo.toLowerCase())) {
        return "이미 등록된 사번입니다.";
    }
    if (candidates.some((item) => item.email.toLowerCase() === values.email.toLowerCase())) {
        return "이미 등록된 이메일입니다.";
    }
    return null;
}

export function validateEmployeeBatch(
    incomingEmployees: EmployeePayload[],
    existingEmployees: Employee[],
) {
    const employeeNos = new Set(existingEmployees.map((item) => item.employeeNo.toLowerCase()));
    const emails = new Set(existingEmployees.map((item) => item.email.toLowerCase()));
    const errors: string[] = [];

    incomingEmployees.forEach((employee, index) => {
        const rowErrors: string[] = [];
        const employeeNo = employee.employeeNo.toLowerCase();
        const email = employee.email.toLowerCase();
        if (employeeNos.has(employeeNo)) rowErrors.push("중복 사번");
        if (emails.has(email)) rowErrors.push("중복 이메일");
        if (rowErrors.length > 0) errors.push(`${index + 2}행: ${rowErrors.join(", ")}`);
        employeeNos.add(employeeNo);
        emails.add(email);
    });

    return errors;
}
