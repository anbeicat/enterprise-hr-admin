/*
 * @Author: anqiao anqiao10@gmail.com
 * @Date: 2026-06-08 19:16:23
 * @LastEditors: anqiao anqiao10@gmail.com
 * @LastEditTime: 2026-06-08 19:18:51
 * @description: mock 数据
 * @FilePath: /enterprise-hr-admin/src/features/employees/mockData.ts
 */
import type { Employee } from "./types";

export const initialEmployees: Employee[] = [
    {
        id: 1,
        employeeNo: "EMP001",
        name: "김민수",
        departmentName: "개발팀",
        position: "대리",
        email: "minsu@company.com",
        phone: "010-1234-5678",
        role: "EMPLOYEE",
        status: "ACTIVE",
        joinedAt: "2024-03-01",
    },
    {
        id: 2,
        employeeNo: "EMP002",
        name: "이지은",
        departmentName: "인사팀",
        position: "과장",
        email: "jieun@company.com",
        phone: "010-2345-6789",
        role: "HR_MANAGER",
        status: "ACTIVE",
        joinedAt: "2023-08-10",
    },
    {
        id: 3,
        employeeNo: "EMP003",
        name: "박준호",
        departmentName: "재무팀",
        position: "차장",
        email: "junho@company.com",
        phone: "010-3456-7890",
        role: "DEPT_MANAGER",
        status: "ON_LEAVE",
        joinedAt: "2022-11-15",
    },
];