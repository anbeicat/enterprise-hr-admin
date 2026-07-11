import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockDatabase } from "./database";
import { getAccountFromRequest, requireAuthentication, requirePermission } from "./auth";

function createRequest(username?: string) {
    return new Request("http://localhost/api/employees", {
        headers: username
            ? { Authorization: `Bearer mock-token-${username}` }
            : undefined,
    });
}

describe("mock API authorization", () => {
    beforeEach(() => {
        const storage = new Map<string, string>();
        vi.stubGlobal("localStorage", {
            getItem: (key: string) => storage.get(key) ?? null,
            setItem: (key: string, value: string) => storage.set(key, value),
            removeItem: (key: string) => storage.delete(key),
        });
    });

    it("resolves the account from a valid bearer token", () => {
        expect(getAccountFromRequest(createRequest("manager"))).toMatchObject({
            role: "DEPT_MANAGER",
            department: "개발팀",
        });
    });

    it("returns 401 when the token is missing", () => {
        expect(requirePermission(createRequest(), "employee:read")?.status).toBe(401);
    });

    it("returns 403 when the role lacks permission", () => {
        expect(
            requirePermission(createRequest("employee"), "employee:write")?.status,
        ).toBe(403);
        expect(mockDatabase.getLogs()[0]).toMatchObject({
            user: "employee",
            module: "권한 관리",
            result: "FAIL",
        });
    });

    it("allows authorized operations", () => {
        expect(requirePermission(createRequest("hr"), "employee:write")).toBeNull();
        expect(requirePermission(createRequest("admin"), "role:manage")).toBeNull();
    });

    it("uses the persisted role configuration instead of a hardcoded map", () => {
        const roles = mockDatabase.getRoles();
        mockDatabase.saveRoles(roles.map((role) =>
            role.code === "EMPLOYEE"
                ? { ...role, permissions: [...role.permissions, "employee:read"] }
                : role,
        ));

        expect(requirePermission(createRequest("employee"), "employee:read")).toBeNull();
    });

    it("rejects sessions whose role has been disabled", () => {
        mockDatabase.saveRoles(mockDatabase.getRoles().map((role) =>
            role.code === "EMPLOYEE" ? { ...role, status: "DISABLED" } : role,
        ));

        expect(requireAuthentication(createRequest("employee"))?.status).toBe(403);
    });
});
