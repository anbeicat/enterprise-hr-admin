export interface Role {
    id: number;
    name: string;
    code: string;
    description: string;
    permissions: string[];
    status: "ACTIVE" | "DISABLED";
}

export type RoleFormValues = Omit<Role, "id">;
