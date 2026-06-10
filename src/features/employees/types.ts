/*
 * @Author: anqiao anqiao10@gmail.com
 * @Date: 2026-06-08 19:16:28
 * @LastEditors: anqiao anqiao10@gmail.com
 * @LastEditTime: 2026-06-08 19:17:57
 * @description: 员工类型文件
 * @FilePath: /enterprise-hr-admin/src/features/employees/types.ts
 */
export type EmployeeStatus = "ACTIVE" | "ON_LEAVE" | "RESIGNED";

export type EmployeeRole = "ADMIN" | "HR_MANAGER" | "DEPT_MANAGER" | "EMPLOYEE";

export interface Employee {
    id: number;
    employeeNo: string;
    name: string;
    departmentName: string;
    position: string;
    email: string;
    phone: string;
    role: EmployeeRole;
    status: EmployeeStatus;
    joinedAt: string;
}

export interface EmployeeSearchParams {
    employeeNo?: string;
    name?: string;
    departmentName?: string;
    status?: EmployeeStatus;
}