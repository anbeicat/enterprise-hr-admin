import type { Department } from "./types";

export function flattenDepartments(items: Department[]): Department[] {
    return items.flatMap((item) => [
        item,
        ...(item.children ? flattenDepartments(item.children) : []),
    ]);
}

export function filterDepartmentTree(
    items: Department[],
    predicate: (department: Department) => boolean,
): Department[] {
    return items.flatMap((item) => {
        const children = item.children
            ? filterDepartmentTree(item.children, predicate)
            : [];

        if (!predicate(item) && children.length === 0) {
            return [];
        }

        return [{ ...item, children: children.length > 0 ? children : undefined }];
    });
}

export function updateDepartmentTree(
    items: Department[],
    department: Department,
): Department[] {
    return items.map((item) => {
        if (item.id === department.id) {
            return { ...department, children: item.children };
        }

        return item.children
            ? { ...item, children: updateDepartmentTree(item.children, department) }
            : item;
    });
}

export function addDepartmentToTree(
    items: Department[],
    department: Department,
): Department[] {
    if (department.parentId === null) {
        return [...items, department].sort((a, b) => a.orderNo - b.orderNo);
    }

    return items.map((item) => {
        if (item.id === department.parentId) {
            return {
                ...item,
                children: [...(item.children ?? []), department].sort(
                    (a, b) => a.orderNo - b.orderNo,
                ),
            };
        }

        return item.children
            ? { ...item, children: addDepartmentToTree(item.children, department) }
            : item;
    });
}

export function removeDepartmentsFromTree(
    items: Department[],
    ids: Set<number>,
): Department[] {
    return items
        .filter((item) => !ids.has(item.id))
        .map((item) => ({
            ...item,
            children: item.children
                ? removeDepartmentsFromTree(item.children, ids)
                : undefined,
        }));
}
