export interface MenuRecord {
    id: number;
    name: string;
    type: "DIRECTORY" | "MENU" | "BUTTON";
    path: string;
    permission: string;
    orderNo: number;
    status: "ACTIVE" | "DISABLED";
    children?: MenuRecord[];
}
