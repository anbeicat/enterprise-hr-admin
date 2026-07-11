import { describe, expect, it } from "vitest";
import { canAccessRoute, hasPermission } from "./access";

describe("role access policy", () => {
    it("allows administrators to manage system data", () => {
        expect(hasPermission("ADMIN", "employee:write")).toBe(true);
        expect(hasPermission("ADMIN", "demo:reset")).toBe(true);
        expect(canAccessRoute("ADMIN", "/system/roles")).toBe(true);
    });

    it("limits HR managers to HR and approval operations", () => {
        expect(hasPermission("HR_MANAGER", "employee:write")).toBe(true);
        expect(hasPermission("HR_MANAGER", "role:manage")).toBe(false);
        expect(canAccessRoute("HR_MANAGER", "/system/employees")).toBe(true);
        expect(canAccessRoute("HR_MANAGER", "/system/roles")).toBe(false);
    });

    it("prevents employees from opening administrative pages", () => {
        expect(canAccessRoute("EMPLOYEE", "/dashboard")).toBe(true);
        expect(canAccessRoute("EMPLOYEE", "/requests/leave")).toBe(true);
        expect(canAccessRoute("EMPLOYEE", "/system/employees")).toBe(false);
        expect(hasPermission("EMPLOYEE", "approval:process")).toBe(false);
    });
});
