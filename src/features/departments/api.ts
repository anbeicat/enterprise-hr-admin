import { apiClient } from "../../api/client";
import type { Department, DepartmentFormValues } from "./types";

export async function getDepartments() {
    const response = await apiClient.get<Department[]>("/departments");
    return response.data;
}

export async function createDepartment(values: DepartmentFormValues) {
    const response = await apiClient.post<Department>("/departments", values);
    return response.data;
}

export async function updateDepartment(id: number, values: DepartmentFormValues) {
    const response = await apiClient.put<Department>(`/departments/${id}`, values);
    return response.data;
}

export async function deleteDepartment(id: number) {
    await apiClient.delete(`/departments/${id}`);
}
