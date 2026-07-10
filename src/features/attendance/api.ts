import { apiClient } from "../../api/client";
import type { AttendanceRecord } from "./types";

export async function getAttendance() {
    const response = await apiClient.get<AttendanceRecord[]>("/attendance");
    return response.data;
}
