import { apiClient } from "../../api/client";
import type { Notice, NoticeFormValues } from "./types";

export async function getNotices() {
    const response = await apiClient.get<Notice[]>("/notices");
    return response.data;
}

export async function createNotice(values: NoticeFormValues) {
    const response = await apiClient.post<Notice>("/notices", values);
    return response.data;
}

export async function updateNotice(id: number, values: NoticeFormValues) {
    const response = await apiClient.put<Notice>(`/notices/${id}`, values);
    return response.data;
}

export async function deleteNotice(id: number) {
    await apiClient.delete(`/notices/${id}`);
}
