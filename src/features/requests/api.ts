import { apiClient } from "../../api/client";
import type { RequestRecord, RequestType } from "./types";

export type RequestPayload = Omit<RequestRecord, "id">;

export async function getRequests(type?: RequestType) {
    const response = await apiClient.get<RequestRecord[]>("/approval-requests", {
        params: type ? { type } : undefined,
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
