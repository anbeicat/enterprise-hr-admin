/*
 * @Author: anqiao anqiao10@gmail.com
 * @Date: 2026-06-08 19:16:05
 * @LastEditors: anqiao anqiao10@gmail.com
 * @LastEditTime: 2026-06-08 19:18:34
 * @description: 常量文件
 * @FilePath: /enterprise-hr-admin/src/features/employees/constants.ts
 */
import type { EmployeeRole, EmployeeStatus } from "./types";

export const EMPLOYEE_STATUS_OPTIONS: {
    label: string;
    value: EmployeeStatus;
}[] = [
        { label: "재직", value: "ACTIVE" },
        { label: "휴직", value: "ON_LEAVE" },
        { label: "퇴사", value: "RESIGNED" },
    ];

export const EMPLOYEE_ROLE_OPTIONS: {
    label: string;
    value: EmployeeRole;
}[] = [
        { label: "관리자", value: "ADMIN" },
        { label: "인사 관리자", value: "HR_MANAGER" },
        { label: "부서장", value: "DEPT_MANAGER" },
        { label: "일반 직원", value: "EMPLOYEE" },
    ];

export const DEPARTMENT_OPTIONS = [
    { label: "개발팀", value: "개발팀" },
    { label: "인사팀", value: "인사팀" },
    { label: "재무팀", value: "재무팀" },
    { label: "영업팀", value: "영업팀" },
    { label: "마케팅팀", value: "마케팅팀" },
];

export const POSITION_OPTIONS = [
    { label: "사원", value: "사원" },
    { label: "대리", value: "대리" },
    { label: "과장", value: "과장" },
    { label: "차장", value: "차장" },
    { label: "부장", value: "부장" },
    { label: "팀장", value: "팀장" },
];

export const EMPLOYEE_STATUS_TEXT: Record<EmployeeStatus, string> = {
    ACTIVE: "재직",
    ON_LEAVE: "휴직",
    RESIGNED: "퇴사",
};

export const EMPLOYEE_STATUS_COLOR: Record<EmployeeStatus, string> = {
    ACTIVE: "green",
    ON_LEAVE: "orange",
    RESIGNED: "red",
};

export const EMPLOYEE_ROLE_TEXT: Record<EmployeeRole, string> = {
    ADMIN: "관리자",
    HR_MANAGER: "인사 관리자",
    DEPT_MANAGER: "부서장",
    EMPLOYEE: "일반 직원",
};