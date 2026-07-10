import type { Role } from "./types";

export const initialRoles: Role[] = [
    { id: 1, name: "시스템 관리자", code: "ADMIN", description: "시스템 전체 관리", permissions: ["employee:list", "employee:write", "department:write", "approval:process", "audit:list"], status: "ACTIVE" },
    { id: 2, name: "인사 관리자", code: "HR_MANAGER", description: "인사 및 근태 관리", permissions: ["employee:list", "employee:write", "department:write", "approval:process"], status: "ACTIVE" },
    { id: 3, name: "부서장", code: "DEPT_MANAGER", description: "소속 부서 결재 처리", permissions: ["employee:list", "approval:process"], status: "ACTIVE" },
    { id: 4, name: "일반 직원", code: "EMPLOYEE", description: "본인 정보 및 신청 관리", permissions: [], status: "ACTIVE" },
];
