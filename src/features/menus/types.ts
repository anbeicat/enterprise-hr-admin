export interface MenuRecord {
    id: number;
    parentId: number | null;
    name: string;
    type: "DIRECTORY" | "MENU" | "BUTTON";
    path: string;
    permission: string;
    orderNo: number;
    status: "ACTIVE" | "DISABLED";
    children?: MenuRecord[];
}

export type MenuFormValues = Omit<MenuRecord, "id" | "children">;
