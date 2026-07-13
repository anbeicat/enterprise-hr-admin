import { describe, expect, it } from "vitest";
import { initialLogs } from "./mockData";
import { queryLogPage } from "./query";

describe("queryLogPage", () => {
    it("filters log type, result and date before pagination", () => {
        const result = queryLogPage(initialLogs, {
            type: "login",
            result: "FAIL",
            startDate: "2026-07-10",
            endDate: "2026-07-10",
            page: 1,
            size: 10,
        });
        expect(result.total).toBe(1);
        expect(result.content[0]).toMatchObject({ type: "login", result: "FAIL" });
    });
});
