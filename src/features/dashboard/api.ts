import { apiClient } from "../../api/client";
import type { DashboardSummary } from "./types";

export async function getDashboardSummary() {
    const response = await apiClient.get<DashboardSummary>("/dashboard");
    return response.data;
}
