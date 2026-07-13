import { describe, expect, it } from "vitest";
import { initialAttendance } from "./mockData";
import { queryAttendancePage } from "./query";

describe("queryAttendancePage", () => {
    it("filters records and calculates summary from the same result set", () => {
        const result = queryAttendancePage(initialAttendance, {
            month: "2026-07",
            department: "개발팀",
            page: 1,
            size: 10,
        });

        expect(result.content.every((item) => item.department === "개발팀")).toBe(true);
        expect(result.total).toBeGreaterThan(0);
        expect(result.summary.attendanceRate).toBeGreaterThan(0);
        expect(result.departmentStats).toHaveLength(1);
    });

    it("paginates without changing aggregate statistics", () => {
        const first = queryAttendancePage(initialAttendance, { month: "2026-07", page: 1, size: 2 });
        const second = queryAttendancePage(initialAttendance, { month: "2026-07", page: 2, size: 2 });

        expect(first.content).toHaveLength(2);
        expect(second.content).toHaveLength(2);
        expect(second.total).toBe(first.total);
        expect(second.summary).toEqual(first.summary);
    });
});
