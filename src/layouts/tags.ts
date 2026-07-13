export interface TagItem {
    path: string;
    title: string;
}

export const DASHBOARD_TAG: TagItem = { path: "/dashboard", title: "대시보드" };
export const TAGS_STORAGE_KEY = "enterprise-hr-open-tabs-v1";

export function appendTag(tags: TagItem[], tag: TagItem) {
    return tags.some((item) => item.path === tag.path) ? tags : [...tags, tag];
}

export function removeTag(tags: TagItem[], path: string, activePath: string) {
    if (path === DASHBOARD_TAG.path) return { tags, nextPath: activePath };
    const index = tags.findIndex((item) => item.path === path);
    const nextTags = tags.filter((item) => item.path !== path);
    if (path !== activePath) return { tags: nextTags, nextPath: activePath };
    const nextTag = nextTags[Math.max(0, index - 1)] ?? DASHBOARD_TAG;
    return { tags: nextTags, nextPath: nextTag.path };
}

export function normalizeStoredTags(value: unknown): TagItem[] {
    if (!Array.isArray(value)) return [DASHBOARD_TAG];
    const unique = new Map<string, TagItem>([[DASHBOARD_TAG.path, DASHBOARD_TAG]]);
    value.forEach((item) => {
        if (
            item &&
            typeof item === "object" &&
            typeof (item as TagItem).path === "string" &&
            typeof (item as TagItem).title === "string"
        ) unique.set((item as TagItem).path, item as TagItem);
    });
    return Array.from(unique.values());
}
