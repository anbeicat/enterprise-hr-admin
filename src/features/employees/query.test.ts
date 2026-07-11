import { describe, expect, it } from "vitest";
import { initialEmployees } from "./mockData";
import { queryEmployeePage } from "./query";

describe("employee server query", () => {
    it("filters employees before applying pagination", () => {
        const result = queryEmployeePage(initialEmployees, {
            departmentName: "개발팀",
            page: 1,
            size: 1,
        });

        expect(result.total).toBe(1);
        expect(result.content[0].departmentName).toBe("개발팀");
        expect(result.page).toBe(1);
    });

    it("returns a stable page contract for out-of-range pages", () => {
        const result = queryEmployeePage(initialEmployees, { page: 99, size: 10 });

        expect(result.content).toEqual([]);
        expect(result.total).toBe(initialEmployees.length);
        expect(result.page).toBe(99);
    });
});
