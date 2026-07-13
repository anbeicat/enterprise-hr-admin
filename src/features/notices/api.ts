import { apiClient } from "../../api/client";
import type { PageResponse } from "../../types/page";
import type { Notice, NoticeFormValues, NoticeListParams } from "./types";

export async function getNotices(params: NoticeListParams) {
    const response = await apiClient.get<PageResponse<Notice>>("/notices", { params });
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
