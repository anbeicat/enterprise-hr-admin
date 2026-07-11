import { describe, expect, it } from "vitest";
import { canAccessRoute, hasPermission, ROLE_PERMISSIONS } from "./access";

describe("role access policy", () => {
    it("allows administrators to manage system data", () => {
        expect(hasPermission(ROLE_PERMISSIONS.ADMIN, "employee:write")).toBe(true);
        expect(hasPermission(ROLE_PERMISSIONS.ADMIN, "demo:reset")).toBe(true);
        expect(canAccessRoute(ROLE_PERMISSIONS.ADMIN, "/system/roles")).toBe(true);
    });

    it("limits HR managers to HR and approval operations", () => {
        expect(hasPermission(ROLE_PERMISSIONS.HR_MANAGER, "employee:write")).toBe(true);
        expect(hasPermission(ROLE_PERMISSIONS.HR_MANAGER, "role:manage")).toBe(false);
        expect(canAccessRoute(ROLE_PERMISSIONS.HR_MANAGER, "/system/employees")).toBe(true);
        expect(canAccessRoute(ROLE_PERMISSIONS.HR_MANAGER, "/system/roles")).toBe(false);
    });

    it("prevents employees from opening administrative pages", () => {
        expect(canAccessRoute(ROLE_PERMISSIONS.EMPLOYEE, "/dashboard")).toBe(true);
        expect(canAccessRoute(ROLE_PERMISSIONS.EMPLOYEE, "/requests/leave")).toBe(true);
        expect(canAccessRoute(ROLE_PERMISSIONS.EMPLOYEE, "/system/employees")).toBe(false);
        expect(hasPermission(ROLE_PERMISSIONS.EMPLOYEE, "approval:process")).toBe(false);
    });
});
