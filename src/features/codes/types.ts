export interface CodeItem {
    id: number;
    group: string;
    code: string;
    name: string;
    orderNo: number;
    active: boolean;
}

export type CodePayload = Omit<CodeItem, "id">;
