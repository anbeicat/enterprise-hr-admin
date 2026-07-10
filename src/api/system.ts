import { apiClient } from "./client";

export async function resetDemoData() {
    await apiClient.post("/demo/reset");
}
