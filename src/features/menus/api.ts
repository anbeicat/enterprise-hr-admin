import { apiClient } from "../../api/client";
import type { MenuRecord } from "./types";

export async function getMenus() {
    const response = await apiClient.get<MenuRecord[]>("/menus");
    return response.data;
}
