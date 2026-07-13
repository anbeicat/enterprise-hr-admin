import { describe, expect, it } from "vitest";
import { initialMenus } from "./mockData";
import { addMenuToTree, flattenMenus, getActiveMenuPaths, removeMenuFromTree, updateMenuTree } from "./utils";

describe("menu tree utilities", () => {
    it("adds, moves and removes a menu while preserving the tree", () => {
        const created = { id: 99, parentId: 10, name: "테스트", type: "MENU" as const, path: "/test", permission: "", orderNo: 9, status: "ACTIVE" as const };
        const added = addMenuToTree(initialMenus, created);
        expect(flattenMenus(added).some((item) => item.id === 99)).toBe(true);

        const moved = updateMenuTree(added, { ...created, parentId: 20 });
        expect(flattenMenus(moved).find((item) => item.id === 99)?.parentId).toBe(20);
        expect(flattenMenus(removeMenuFromTree(moved, 99)).some((item) => item.id === 99)).toBe(false);
    });

    it("hides descendants when a parent directory is disabled", () => {
        const menus = initialMenus.map((item) => item.id === 10 ? { ...item, status: "DISABLED" as const } : item);
        const paths = getActiveMenuPaths(menus);
        expect(paths.has("/system/employees")).toBe(false);
        expect(paths.has("/dashboard")).toBe(true);
    });
});
