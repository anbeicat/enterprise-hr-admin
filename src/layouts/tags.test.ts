import { describe, expect, it } from "vitest";
import { DASHBOARD_TAG, appendTag, normalizeStoredTags, removeTag } from "./tags";

describe("TagsView state", () => {
    const employee = { path: "/system/employees", title: "직원 관리" };
    const department = { path: "/system/departments", title: "조직 관리" };

    it("keeps previously visited pages without duplicates", () => {
        const tags = appendTag(appendTag([DASHBOARD_TAG], employee), department);
        expect(appendTag(tags, employee)).toEqual(tags);
        expect(tags.map((item) => item.path)).toEqual(["/dashboard", employee.path, department.path]);
    });

    it("navigates to the closest left tab when the active tab closes", () => {
        const tags = [DASHBOARD_TAG, employee, department];
        expect(removeTag(tags, department.path, department.path)).toEqual({
            tags: [DASHBOARD_TAG, employee],
            nextPath: employee.path,
        });
        expect(removeTag(tags, employee.path, department.path).nextPath).toBe(department.path);
    });

    it("always restores the pinned dashboard tab from storage", () => {
        expect(normalizeStoredTags([employee, employee])).toEqual([DASHBOARD_TAG, employee]);
        expect(normalizeStoredTags("invalid")).toEqual([DASHBOARD_TAG]);
    });
});
