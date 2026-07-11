import { beforeEach, describe, expect, it, vi } from "vitest";
import { initialLogs } from "../features/logs/mockData";
import { mockDatabase } from "./database";
import { recordLog } from "./audit";

describe("mock audit log", () => {
    beforeEach(() => {
        const storage = new Map<string, string>();
        vi.stubGlobal("localStorage", {
            getItem: (key: string) => storage.get(key) ?? null,
            setItem: (key: string, value: string) => storage.set(key, value),
            removeItem: (key: string) => storage.delete(key),
        });
    });

    it("stores a new audit record before existing records", () => {
        const log = recordLog({
            request: new Request("http://localhost/api/employees"),
            user: "admin",
            module: "직원 관리",
            action: "직원 EMP999 등록",
        });

        expect(log.id).toBe(Math.max(...initialLogs.map((item) => item.id)) + 1);
        expect(mockDatabase.getLogs()[0]).toMatchObject({
            user: "admin",
            action: "직원 EMP999 등록",
            result: "SUCCESS",
        });
    });

    it("resets persisted audit data with other demo data", () => {
        recordLog({
            request: new Request("http://localhost/api/auth/login"),
            user: "unknown",
            type: "login",
            module: "로그인",
            action: "비밀번호 불일치",
            result: "FAIL",
        });
        mockDatabase.reset();

        expect(mockDatabase.getLogs()).toEqual(initialLogs);
    });
});
