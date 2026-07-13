import type { UserRole } from "../store/authSlice";

export type Permission =
    | "employee:read"
    | "employee:write"
    | "department:read"
    | "department:write"
    | "role:manage"
    | "menu:manage"
    | "code:manage"
    | "request:create"
    | "approval:process"
    | "attendance:read"
    | "attendance:write"
    | "notice:read"
    | "notice:manage"
    | "log:read"
    | "demo:reset";

export const ALL_PERMISSIONS: Permission[] = [
    "employee:read",
    "employee:write",
    "department:read",
    "department:write",
    "role:manage",
    "menu:manage",
    "code:manage",
    "request:create",
    "approval:process",
    "attendance:read",
    "attendance:write",
    "notice:read",
    "notice:manage",
    "log:read",
    "demo:reset",
];

export const PERMISSION_OPTIONS: { label: string; value: Permission }[] = [
    { label: "직원 조회", value: "employee:read" },
    { label: "직원 등록/수정/삭제", value: "employee:write" },
    { label: "조직 조회", value: "department:read" },
    { label: "조직 등록/수정/삭제", value: "department:write" },
    { label: "역할 관리", value: "role:manage" },
    { label: "메뉴 관리", value: "menu:manage" },
    { label: "공통 코드 관리", value: "code:manage" },
    { label: "휴가/연장근무/출장 신청", value: "request:create" },
    { label: "결재 승인/반려", value: "approval:process" },
    { label: "근태 조회", value: "attendance:read" },
    { label: "근태 기록 수정", value: "attendance:write" },
    { label: "공지 조회", value: "notice:read" },
    { label: "공지 등록/수정/삭제", value: "notice:manage" },
    { label: "감사/로그인 로그 조회", value: "log:read" },
    { label: "데모 데이터 초기화", value: "demo:reset" },
];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    ADMIN: ALL_PERMISSIONS,
    HR_MANAGER: [
        "employee:read",
        "employee:write",
        "department:read",
        "department:write",
        "request:create",
        "approval:process",
        "attendance:read",
        "attendance:write",
        "notice:read",
        "notice:manage",
        "log:read",
    ],
    DEPT_MANAGER: [
        "request:create",
        "approval:process",
        "attendance:read",
        "notice:read",
    ],
    EMPLOYEE: ["request:create", "attendance:read", "notice:read"],
};

export const ROUTE_PERMISSIONS: Record<string, Permission | undefined> = {
    "/dashboard": undefined,
    "/system/employees": "employee:read",
    "/system/departments": "department:read",
    "/system/roles": "role:manage",
    "/system/menus": "menu:manage",
    "/system/dictionaries": "code:manage",
    "/requests/leave": "request:create",
    "/requests/overtime": "request:create",
    "/requests/business-trip": "request:create",
    "/approvals/pending": "approval:process",
    "/approvals/my-requests": "request:create",
    "/approvals/history": "approval:process",
    "/attendance/status": "attendance:read",
    "/attendance/monthly": "attendance:read",
    "/notices": "notice:read",
    "/logs/audit": "log:read",
    "/logs/login": "log:read",
};

export function hasPermission(permissions: readonly Permission[] | null, permission: Permission) {
    return permissions?.includes(permission) ?? false;
}

export function canAccessRoute(permissions: readonly Permission[] | null, path: string) {
    if (path === "/dashboard" || path === "/403") return true;
    const permission = ROUTE_PERMISSIONS[path];
    return permission ? hasPermission(permissions, permission) : false;
}
