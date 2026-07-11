import type { Permission } from "../../auth/access";

export interface Role {
    id: number;
    name: string;
    code: string;
    description: string;
    permissions: Permission[];
    status: "ACTIVE" | "DISABLED";
}

export type RoleFormValues = Omit<Role, "id">;
