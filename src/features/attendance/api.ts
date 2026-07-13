import { apiClient } from "../../api/client";
import type {
    AttendanceListParams,
    AttendancePage,
    AttendanceRecord,
    AttendanceUpdatePayload,
} from "./types";

export async function getAttendance(params: AttendanceListParams) {
    const response = await apiClient.get<AttendancePage>("/attendance", { params });
    return response.data;
}

export async function updateAttendance(id: number, values: AttendanceUpdatePayload) {
    const response = await apiClient.put<AttendanceRecord>(`/attendance/${id}`, values);
    return response.data;
}
