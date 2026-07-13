import { describe, expect, it } from "vitest";
import { initialRequests } from "./mockData";
import { queryRequestPage } from "./query";

describe("queryRequestPage", () => {
    it("supports approval inbox views on the server", () => {
        const pending = queryRequestPage(initialRequests, { view: "pending", page: 1, size: 10 });
        const history = queryRequestPage(initialRequests, { view: "history", page: 1, size: 10 });

        expect(pending.content.every((item) => item.status === "PENDING")).toBe(true);
        expect(history.content.every((item) => item.status !== "PENDING")).toBe(true);
    });

    it("filters by keyword, type and application date", () => {
        const result = queryRequestPage(initialRequests, {
            type: "BUSINESS_TRIP",
            keyword: "부산",
            startDate: "2026-07-10",
            endDate: "2026-07-10",
            page: 1,
            size: 10,
        });
        expect(result.total).toBe(1);
    });
});
