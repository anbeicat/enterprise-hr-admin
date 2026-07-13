export interface Notice {
    id: number;
    title: string;
    content: string;
    author: string;
    pinned: boolean;
    views: number;
    createdAt: string;
}

export type NoticeFormValues = Pick<Notice, "title" | "content" | "pinned">;

export interface NoticeListParams {
    keyword?: string;
    author?: string;
    pinned?: boolean;
    page: number;
    size: number;
}
