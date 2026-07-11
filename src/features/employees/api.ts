import { apiClient } from "../../api/client";
import type { Employee } from "./types";

export type EmployeePayload = Omit<Employee, "id">;

export async function getEmployees() {
    const response = await apiClient.get<Employee[]>("/employees");
    return response.data;
}

export async function createEmployee(values: EmployeePayload) {
    const response = await apiClient.post<Employee>("/employees", values);
    return response.data;
}

export async function updateEmployee(id: number, values: EmployeePayload) {
    const response = await apiClient.put<Employee>(`/employees/${id}`, values);
    return response.data;
}

export async function deleteEmployee(id: number) {
    await apiClient.delete(`/employees/${id}`);
}

export async function importEmployees(employees: EmployeePayload[]) {
    const response = await apiClient.post<{ created: Employee[] }>("/employees/import", {
        employees,
    });
    return response.data;
}
