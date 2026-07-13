import { apiClient } from "../../api/client";
import type { PageResponse } from "../../types/page";
import type { RequestListParams, RequestRecord } from "./types";

export type RequestPayload = Omit<RequestRecord, "id">;

export async function getRequests(params: RequestListParams) {
    const response = await apiClient.get<PageResponse<RequestRecord>>("/approval-requests", {
        params,
    });
    return response.data;
}

export async function createRequest(values: RequestPayload) {
    const response = await apiClient.post<RequestRecord>("/approval-requests", values);
    return response.data;
}

export async function processRequest(
    id: number,
    action: "approve" | "reject",
    comment?: string,
) {
    const response = await apiClient.put<RequestRecord>(
        `/approval-requests/${id}/${action}`,
        { comment },
    );
    return response.data;
}

export async function cancelRequest(id: number) {
    const response = await apiClient.put<RequestRecord>(
        `/approval-requests/${id}/cancel`,
    );
    return response.data;
}
