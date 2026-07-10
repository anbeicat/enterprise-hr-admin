import { apiClient } from "../../api/client";
import type { LogRecord, LogType } from "./types";

export async function getLogs(type: LogType) {
    const response = await apiClient.get<LogRecord[]>("/logs", { params: { type } });
    return response.data;
}
