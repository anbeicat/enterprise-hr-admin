import { describe, expect, it } from "vitest";
import { initialNotices } from "./mockData";
import { queryNoticePage } from "./query";

describe("queryNoticePage", () => {
    it("searches content and keeps pinned notices first", () => {
        const result = queryNoticePage(initialNotices, { page: 1, size: 10 });
        expect(result.content[0].pinned).toBe(true);

        const searched = queryNoticePage(initialNotices, { keyword: "점검", page: 1, size: 10 });
        expect(searched.total).toBe(1);
        expect(searched.content[0].title).toContain("점검");
    });
});
