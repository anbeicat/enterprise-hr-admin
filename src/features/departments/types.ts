export type DepartmentStatus = "ACTIVE" | "DISABLED";

export interface Department {
    id: number;
    parentId: number | null;
    name: string;
    orderNo: number;
    managerName: string;
    phone: string;
    status: DepartmentStatus;
    createdAt: string;
    children?: Department[];
}

export interface DepartmentSearchParams {
    name?: string;
    status?: DepartmentStatus;
}

export type DepartmentFormValues = Omit<
    Department,
    "id" | "createdAt" | "children"
>;
