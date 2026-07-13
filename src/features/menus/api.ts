import { apiClient } from "../../api/client";
import type { MenuFormValues, MenuRecord } from "./types";

export async function getMenus() {
    const response = await apiClient.get<MenuRecord[]>("/menus");
    return response.data;
}

export async function createMenu(values: MenuFormValues) {
    const response = await apiClient.post<MenuRecord>("/menus", values);
    return response.data;
}

export async function updateMenu(id: number, values: MenuFormValues) {
    const response = await apiClient.put<MenuRecord>(`/menus/${id}`, values);
    return response.data;
}

export async function deleteMenu(id: number) {
    await apiClient.delete(`/menus/${id}`);
}
