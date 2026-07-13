export type AttendanceStatus = "NORMAL" | "LATE" | "EARLY_LEAVE" | "LEAVE";

export interface AttendanceRecord {
    id: number;
    employeeNo: string;
    name: string;
    department: string;
    workDate: string;
    checkIn: string;
    checkOut: string;
    workHours: number;
    overtimeHours: number;
    status: AttendanceStatus;
}

export interface AttendanceListParams {
    month: string;
    keyword?: string;
    department?: string;
    status?: AttendanceStatus;
    workDate?: string;
    page: number;
    size: number;
}

export interface AttendanceSummary {
    attendanceRate: number;
    lateCount: number;
    leaveCount: number;
    overtimeHours: number;
}

export interface DepartmentAttendanceSummary {
    department: string;
    attendanceRate: number;
    total: number;
}

export interface AttendancePage {
    content: AttendanceRecord[];
    total: number;
    page: number;
    size: number;
    summary: AttendanceSummary;
    departmentStats: DepartmentAttendanceSummary[];
}

export type AttendanceUpdatePayload = Pick<
    AttendanceRecord,
    "checkIn" | "checkOut" | "workHours" | "overtimeHours" | "status"
>;
