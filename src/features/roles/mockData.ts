import type { Role } from "./types";
import { ROLE_PERMISSIONS } from "../../auth/access";

export const initialRoles: Role[] = [
    { id: 1, name: "시스템 관리자", code: "ADMIN", description: "시스템 전체 관리", permissions: ROLE_PERMISSIONS.ADMIN, status: "ACTIVE" },
    { id: 2, name: "인사 관리자", code: "HR_MANAGER", description: "인사 및 근태 관리", permissions: ROLE_PERMISSIONS.HR_MANAGER, status: "ACTIVE" },
    { id: 3, name: "부서장", code: "DEPT_MANAGER", description: "소속 부서 결재 처리", permissions: ROLE_PERMISSIONS.DEPT_MANAGER, status: "ACTIVE" },
    { id: 4, name: "일반 직원", code: "EMPLOYEE", description: "본인 정보 및 신청 관리", permissions: ROLE_PERMISSIONS.EMPLOYEE, status: "ACTIVE" },
];
