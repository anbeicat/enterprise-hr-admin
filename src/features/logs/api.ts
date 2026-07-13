import { apiClient } from "../../api/client";
import type { PageResponse } from "../../types/page";
import type { LogListParams, LogRecord } from "./types";

export async function getLogs(params: LogListParams) {
    const response = await apiClient.get<PageResponse<LogRecord>>("/logs", { params });
    return response.data;
}
