import type { CodeItem } from "./types";

export const initialCodes: CodeItem[] = [
    { id: 1, group: "POSITION", code: "STAFF", name: "사원", orderNo: 1, active: true },
    { id: 2, group: "POSITION", code: "ASSISTANT_MANAGER", name: "대리", orderNo: 2, active: true },
    { id: 3, group: "LEAVE_TYPE", code: "ANNUAL", name: "연차", orderNo: 1, active: true },
    { id: 4, group: "LEAVE_TYPE", code: "SICK", name: "병가", orderNo: 2, active: true },
    { id: 5, group: "EMPLOYEE_STATUS", code: "ACTIVE", name: "재직", orderNo: 1, active: true },
];
