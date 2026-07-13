import type { MenuRecord } from "./types";

export function flattenMenus(menus: MenuRecord[]): MenuRecord[] {
    return menus.flatMap((item) => [item, ...(item.children ? flattenMenus(item.children) : [])]);
}

export function addMenuToTree(menus: MenuRecord[], menu: MenuRecord): MenuRecord[] {
    if (menu.parentId === null) return [...menus, menu].sort((a, b) => a.orderNo - b.orderNo);
    return menus.map((item) => item.id === menu.parentId
        ? { ...item, children: [...(item.children ?? []), menu].sort((a, b) => a.orderNo - b.orderNo) }
        : { ...item, children: item.children ? addMenuToTree(item.children, menu) : undefined });
}

export function updateMenuTree(menus: MenuRecord[], updated: MenuRecord): MenuRecord[] {
    const withoutCurrent = removeMenuFromTree(menus, updated.id);
    return addMenuToTree(withoutCurrent, updated);
}

export function removeMenuFromTree(menus: MenuRecord[], id: number): MenuRecord[] {
    return menus
        .filter((item) => item.id !== id)
        .map((item) => ({ ...item, children: item.children ? removeMenuFromTree(item.children, id) : undefined }));
}

export function getActiveMenuPaths(menus: MenuRecord[]) {
    const paths = new Set<string>();
    const visit = (items: MenuRecord[], parentActive: boolean) => {
        items.forEach((item) => {
            const active = parentActive && item.status === "ACTIVE";
            if (active && item.type === "MENU" && item.path) paths.add(item.path);
            if (item.children) visit(item.children, active);
        });
    };
    visit(menus, true);
    return paths;
}
