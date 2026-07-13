export interface PageResponse<T> {
    content: T[];
    total: number;
    page: number;
    size: number;
}

export function paginate<T>(items: T[], pageValue: number, sizeValue: number): PageResponse<T> {
    const page = Math.max(1, pageValue);
    const size = Math.min(10_000, Math.max(1, sizeValue));
    const offset = (page - 1) * size;
    return { content: items.slice(offset, offset + size), total: items.length, page, size };
}
