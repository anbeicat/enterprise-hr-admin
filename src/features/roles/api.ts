import { apiClient } from "../../api/client";
import type { Role, RoleFormValues } from "./types";

export async function getRoles() {
    const response = await apiClient.get<Role[]>("/roles");
    return response.data;
}

export async function createRole(values: RoleFormValues) {
    const response = await apiClient.post<Role>("/roles", values);
    return response.data;
}

export async function updateRole(id: number, values: RoleFormValues) {
    const response = await apiClient.put<Role>(`/roles/${id}`, values);
    return response.data;
}

export async function deleteRole(id: number) {
    await apiClient.delete(`/roles/${id}`);
}
