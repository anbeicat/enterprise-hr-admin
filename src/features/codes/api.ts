import { apiClient } from "../../api/client";
import type { CodeItem, CodePayload } from "./types";

export async function getCodes() {
    const response = await apiClient.get<CodeItem[]>("/codes");
    return response.data;
}

export async function createCode(values: CodePayload) {
    const response = await apiClient.post<CodeItem>("/codes", values);
    return response.data;
}

export async function deleteCode(id: number) {
    await apiClient.delete(`/codes/${id}`);
}
