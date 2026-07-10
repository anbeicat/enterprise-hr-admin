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
    | "notice:read"
    | "notice:manage"
    | "log:read"
    | "demo:reset";

const ALL_PERMISSIONS: Permission[] = [
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
    "notice:read",
    "notice:manage",
    "log:read",
    "demo:reset",
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

export function hasPermission(role: UserRole | null, permission: Permission) {
    return role ? ROLE_PERMISSIONS[role].includes(permission) : false;
}

export function canAccessRoute(role: UserRole | null, path: string) {
    if (path === "/dashboard" || path === "/403") return true;
    const permission = ROUTE_PERMISSIONS[path];
    return permission ? hasPermission(role, permission) : false;
}
